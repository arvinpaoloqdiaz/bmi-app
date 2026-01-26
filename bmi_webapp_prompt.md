# BMI Web App - AI IDE Prompt

## Project Overview
Create a **lightweight, static BMI web app** that allows users to calculate their Body Mass Index (BMI). The app should:

- Collect basic info: weight, height, age, sex
- Calculate BMI and show category and short interpretation
- Store results in browser `localStorage` as history for multiple users
- Allow step-by-step input form (wizard-style)
- Optional: advanced questions later (waist circumference, activity level)
- Fully static; deployable to **GitHub Pages** or **Vercel**
- Minimal dependencies; no backend required

---

## User Flow

1. **Step 1: Basic Info Entry**
   - Inputs:
     - Weight
     - Height
     - Age (optional, for interpretation)
     - Sex (optional, for interpretation)
     - Units toggle: kg/lb, cm/in
   - Button: “Calculate BMI”

2. **Step 2: Show BMI Result**
   - Calculate BMI using formula: `BMI = weight / (height²)`
   - Show:
     - BMI value
     - BMI category (Underweight / Normal / Overweight / Obese)
     - Short interpretation
   - Buttons:
     - “Done” → finishes one-time calculation
     - Optional: “Add more insights?” → advanced questions

3. **Step 3: Store Result**
   - Store result as an **entry** in `localStorage` with:
     - Weight, Height, Age, Sex
     - BMI value, Category
     - Timestamp
   - Keep **history array** for multiple users on the same device

4. **Step 4: History Screen**
   - Show list of previous entries:
     - Date/Time
     - BMI
     - Category
     - Optional: user name
   - Buttons:
     - “Add New Measurement” → returns to Step 1
     - Optional: “Clear History”

5. **Optional Advanced Flow**
   - Collect additional info:
     - Waist circumference
     - Activity level
     - Fitness goals
   - Produce enhanced interpretation (future enhancement)

---

## Tech Stack & Libraries

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Markup | HTML5 | Base structure |
| Styling | Tailwind CSS | Responsive, fast styling |
| Logic | Vanilla JS | BMI calculation, localStorage, form flow |
| UI Interactivity | Alpine.js | Step-by-step wizard, dynamic state |
| Input Helpers | Cleave.js (optional) | Input formatting for numbers, units |
| Charts (Optional) | Chart.js / ApexCharts | BMI trends / graphs |
| Deployment | GitHub Pages / Vercel | Static site hosting |

---

## Implementation Notes

- **localStorage** key: `bmiHistory` (store as array of entries)
- **Entry structure:**
```js
{
  id: "20260126_175230", // unique timestamp or UUID
  timestamp: 1737883242000,
  weight: 72,
  height: 175,
  age: 27,
  sex: "male",
  bmi: 23.5,
  category: "Normal"
}
```
- Step form:
  - Show one step at a time
  - Use `x-show` in Alpine.js or JS show/hide
  - Next/Back buttons
- Validation:
  - Require height and weight > 0
  - Age optional
- Optional advanced questions can be added in a later step
- No backend; all data persists locally unless cleared manually

---

## Output Expectations for AI IDE

1. **Project folder structure**
```
bmi-web-app/
├─ index.html
├─ style.css (or Tailwind CDN)
├─ app.js
├─ README.md
└─ assets/
```
2. **Step-by-step BMI form**  
3. **BMI calculation logic**  
4. **History management using localStorage**  
5. **Responsive design** (mobile-first)
6. **Optional input validation**  
7. **Optional future step for advanced questions**

---

## Instructions to AI IDE

- Generate a static web app scaffold using the above stack
- Include **step-by-step wizard UI**
- Include **BMI calculation logic**
- Implement **history tracking in localStorage**
- Keep it minimal, no backend
- Use **Tailwind CSS** for styling, **Alpine.js** for step control
- Output should be immediately deployable to GitHub Pages / Vercel

