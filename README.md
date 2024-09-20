# Puzzle Generator

This project generates a puzzle from an image using Delaunay triangulation and KMeans clustering. The generated puzzle can be visualized using matplotlib.

## Requirements

- Python 3.x
- `pip` for Python package management
- `bun` for JavaScript package management

## Installation

### Python Dependencies

1. **Navigate to the `puzzle-generator` folder**:

```bash
cd puzzle-generator
```

2. Install the required Python packages:

```bash
pip install -r requirements.txt
```

### Image creation

3. Create an image in Copilot / ChatGPT with the following prompt:

```
Hello copilot! Please create a geometric, low-poly style image of a {subject} with white background. All parts of the images are composed of various triangles. Do not use a lot of details and make sure there is a limited amount of triangles in the image.
```

4. Choose one of the images, and save it in the `images/` folder

### Puzzle Generation

5. In `puzzleGenerator.py`, change the filename at the top of the file with the correct filename

6. run `pythin puzzleGenerator.py`

7. The script will generate a `generated.ts` file in `fhl-vertex\leveldata\`

### Running the game

8. Install bun

9. Run `bun run dev` from the `fhl-vertex` folder.

10. Open the localhost link on screen

11. Have fun!
