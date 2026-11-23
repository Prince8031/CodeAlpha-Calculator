# NovaCalc — CodeAlpha Calculator

A responsive, modern calculator built with **HTML, CSS and vanilla JavaScript** for a frontend development internship project.

## Features
- Addition, subtraction, multiplication and division
- Decimal calculations and percentage conversion
- Clear all and delete last character
- Keyboard support (`Enter`, `Esc`, `Backspace`, numbers and operators)
- Recent calculation history (click an entry to reuse its result)
- Light/dark theme toggle
- Responsive layout for desktop, tablet and mobile
- Division-by-zero and invalid-expression handling

## Project structure
```text
CodeAlpha_Calculator/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally
No Node.js packages or build step are required.

1. Extract the ZIP.
2. Open the folder in Visual Studio Code.
3. Open `index.html` with the Live Server extension, or open the file directly in a browser.

## Deploy to Vercel
1. Push these files to a GitHub repository.
2. In Vercel, import the repository.
3. Select **Other** as the framework preset.
4. Keep Build Command and Install Command empty.
5. Set Output Directory to `./` if Vercel requests it.
6. Click **Deploy**.

## Keyboard shortcuts
| Key | Action |
|---|---|
| `0–9` | Enter number |
| `+ - * /` | Operators |
| `.` | Decimal point |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete last character |
| `Esc` | Clear |

## Technologies
- HTML5
- CSS3 (Grid, Flexbox, responsive media queries)
- Vanilla JavaScript (DOM events and calculation logic)

---
Created as a CodeAlpha Frontend Development practice project.
