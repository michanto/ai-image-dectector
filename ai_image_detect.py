# ai_image_detect.py
import requests
import secrets

def detect_ai_generated(image_path):
    """
    Calls the Sightengine API to detect if an image is AI-generated.

    Args:
        image_path (str): The full path to the image file.

    Returns:
        float or None: The confidence score for the 'ai_generated' type,
                       or None if there's an error.
    """
    try:
        with open(image_path, 'rb') as image_file:
            files = {'media': (image_path.split('/')[-1], image_file)}
            data = {
                'models': secrets.AI_MODEL,
                'api_user': secrets.SIGHTENGINE_USER,
                'api_secret': secrets.SIGHTENGINE_SECRET
            }
            response = requests.post(secrets.SIGHTENGINE_API_URL, files=files, data=data)
            response.raise_for_status()  # Raise an exception for bad status codes
            json_response = response.json()
            if 'type' in json_response and 'ai_generated' in json_response['type']:
                return json_response['type']['ai_generated']
            else:
                print(f"Warning: 'ai_generated' field not found in the response: {json_response}")
                return None
    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error calling the Sightengine API: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

if __name__ == '__main__':
    # Example usage (replace with the actual path to your image)
    image_file_path = './01lTyBxcS2L9vruDcS4D2Ho-11.fit_lim.size_768x.png'
    ai_score = detect_ai_generated(image_file_path)
    if ai_score is not None:
        print(f"AI-generated confidence score: {ai_score}")