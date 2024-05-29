from PIL import Image
from sys import argv
import os

# Define source and target directories
source_dir = 'assets/people'
target_dir = 'assets/people-gray'

# Create the target directory if it does not exist
if not os.path.exists(target_dir):
  os.makedirs(target_dir)
  

try:
  assert len(argv) == 2
  grayscale = float(argv[1]) / 100
except:
  print("usage:", argv[0], "<number between 0 and 100>")
  exit(-1)

# Iterate over all files in the source directory
for filename in os.listdir(source_dir):
  if filename.endswith(('.png', '.jpg', '.jpeg')):
    # Define file paths
    source_path = os.path.join(source_dir, filename)
    target_path = os.path.join(target_dir, filename)

    # Open the original image
    original_image = Image.open(source_path)
    
    # Convert the image to grayscale
    gray_image = original_image.convert('L')

    # Convert grayscale back to RGB
    gray_image = gray_image.convert('RGB')
    
    # Blend the original with the grayscale image
    blended_image = Image.blend(original_image, gray_image, grayscale)

    # Save the dimmed image to the target directory
    blended_image.save(target_path)

print("All images dimmed and saved.")
