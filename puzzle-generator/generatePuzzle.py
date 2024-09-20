import json
import os
import sys
import cv2
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

filename = "./images/gptapple.png"

def show_image(image, title='Image'):
    plt.figure(figsize=(8, 8))
    plt.title(title)
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    plt.show()

def get_color_from_triangle(image, triangle):
    """Get the average color inside a triangle."""
    # Create a mask of the same size as the image
    mask = np.zeros_like(image[:, :, 0])  # Single-channel mask
    
    # Define the triangle as a numpy array of shape (3, 2)
    pts = np.array([triangle], np.int32)
    
    # Fill the triangle on the mask
    cv2.fillPoly(mask, pts, 255)
    
    # Calculate the average color in the masked region
    mean_color = cv2.mean(image, mask=mask)[:3]  # Ignore the alpha channel if present
    return convert_color_to_hex(mean_color)  # Return BGR color

def convert_color_to_hex(color):
    # Convert BGR to hex
    return "#{:02x}{:02x}{:02x}".format(int(color[2]), int(color[1]), int(color[0]))

def draw_delaunay(img, subdiv):
    triangleList = subdiv.getTriangleList()
    r = (0, 0, img.shape[1], img.shape[0])  # Rectangle boundary of the image
    
    for t in triangleList:
        pt1 = (int(t[0]), int(t[1]))
        pt2 = (int(t[2]), int(t[3]))
        pt3 = (int(t[4]), int(t[5]))

        delaunay_color = (np.random.randint(0, 256), np.random.randint(0, 256), np.random.randint(0, 256))

        # Only draw triangles that lie within the image boundaries
        if inside_image(r, pt1) and inside_image(r, pt2) and inside_image(r, pt3):
            cv2.line(img, pt1, pt2, delaunay_color, 2)
            cv2.line(img, pt2, pt3, delaunay_color, 2)
            cv2.line(img, pt3, pt1, delaunay_color, 2)

def inside_image(rect, point):
    x, y = point
    if rect[0] <= x < rect[2] and rect[1] <= y < rect[3]:
        return True
    return False

def getClosestVertex(vertex, vertex_list):
    for v in vertex_list:
        if np.linalg.norm(np.array(v) - np.array(vertex)) < 20:
            return v
    return None

# Load the image
image = cv2.imread(filename)

mask = np.zeros(image.shape[:2], np.uint8)

# Define a rectangle around the object (x, y, width, height)
rect = (50, 50, image.shape[1] - 100, image.shape[0] - 100)

# Create temporary arrays used by the algorithm (initialized to 0)
bgd_model = np.zeros((1, 65), np.float64)  # Background model
fgd_model = np.zeros((1, 65), np.float64)  # Foreground model

# Apply the GrabCut algorithm
cv2.grabCut(image, mask, rect, bgd_model, fgd_model, 5, cv2.GC_INIT_WITH_RECT)

# Modify the mask to segment the background from the object
# 0 and 2 are background, 1 and 3 are foreground
mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')

# Apply the mask to the original image to extract the foreground
result = image * mask2[:, :, np.newaxis]

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply GaussianBlur to reduce noise
gray = cv2.GaussianBlur(gray, (5, 5), 0)

# Detect corners in the image (or use other feature detectors)
corners = cv2.goodFeaturesToTrack(gray, maxCorners=100, qualityLevel=0.07, minDistance=10)
corners = np.int32(corners)

# Define the rectangle for the image boundaries
size = image.shape
rect = (0, 0, size[1], size[0])

# Create an instance of Subdiv2D for Delaunay triangulation
subdiv = cv2.Subdiv2D(rect)

# Insert points (corners) into Subdiv2D
for corner in corners:
    point = (int(corner[0][0]), int(corner[0][1]))  # Extract and convert to tuple of integers
    subdiv.insert(point)

# Draw Delaunay triangles
delaunay_image = image.copy()
draw_delaunay(delaunay_image, subdiv)  # Green color for triangles

# Show the result
# show_image(delaunay_image, 'Delaunay Triangulation')

delaunay_triangle_list = subdiv.getTriangleList()
triangle_list = []

for t in delaunay_triangle_list:
  pt1 = (int(t[0]), int(t[1]))
  pt2 = (int(t[2]), int(t[3]))
  pt3 = (int(t[4]), int(t[5]))
  triangle_list.append([pt1, pt2, pt3])

palette = []
vertices = {}  # Map of unique vertices
list_of_coords = []
shapes = []  # Map of each vertex to the list of triangles it's part of

# Process each triangle
for triangle_index, triangle in enumerate(triangle_list):
    # Extract the color inside the triangle
    color = get_color_from_triangle(image, [triangle])
    palette.append(color)  # Append the average color (BGR)
    shapes.append({"color": str(palette.index(color)), "vertices": []})
    
    # Process vertices and map them to triangles
    for vertex in triangle:
        closestVertex = getClosestVertex(vertex, list_of_coords)
        if closestVertex != None:
            closestIndex = list_of_coords.index(closestVertex)
            vertices[closestIndex]["shapes"].append(str(triangle_index))
            shapes[triangle_index]["vertices"].append(closestIndex)
        else:
            vertex_index = len(vertices)
            vertices[vertex_index] = {"coordinates": vertex, "shapes": [str(triangle_index)]}
            shapes[triangle_index]["vertices"].append(vertex_index)
            list_of_coords.append(vertex)
        
        # Add the current triangle to the list of triangles for this vertex
# Print the results
result = {
    "palette": palette,
    "shapes": shapes,
    "vertices": vertices,
}

# Convert the result dictionary to a JSON string
result_json = json.dumps(result)

# Create the file and write the content
file_path = '../fhl-vertex/levelData/generated.ts'

# Create the directory if it doesn't exist
os.makedirs(os.path.dirname(file_path), exist_ok=True)

# Create the file and write the content
with open(file_path, 'w') as file:
  file.write('export const level = ' + result_json)
