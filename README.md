# BMI Calculator Web App

A lightweight, static web application for calculating and tracking Body Mass Index (BMI). This app features a modern dark theme and runs entirely in your browser with no backend required, storing all data locally using browser localStorage.

## Features

### Core Functionality
- **Step-by-Step Wizard Interface**: Easy-to-use multi-step form with progress indicator
- **Flexible Unit Selection**: Independent unit selection for weight (kg/lb) and height (cm/in or feet & inches)
- **BMI Calculation**: Automatic calculation with accurate formula, standardized to metric internally
- **Category Classification**: 
  - Underweight (BMI < 18.5)
  - Normal (BMI 18.5 - 24.9)
  - Overweight (BMI 25 - 29.9)
  - Obese (BMI ≥ 30)
- **Health Interpretation**: Personalized interpretation prominently displayed with each result
- **In-Depth Analysis**: Optional detailed analysis based on age, sex, and other factors
- **History Tracking**: Save and view all your previous BMI calculations
- **Individual Entry Management**: Delete specific entries or clear entire history
- **Unit Conversion Display**: View measurements in both metric and imperial units simultaneously

### User Experience
- **Name Entry (Optional)**: Personalize your tracking with an optional name
- **History Access**: View history from the welcome screen or any step
- **Clickable History**: Click any history entry to view its detailed analysis
- **Data Storage Warnings**: Clear notifications about localStorage limitations
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark color scheme that's easy on the eyes

### Design
- **Dark Color Scheme**: 
  - Background: `#1E1E2F` (dark, non-black)
  - Cards/Forms: `#2A2A3D` with rounded corners
  - Primary Actions: Cyan `#00B8D9` with hover states
  - Category Colors: Cyan for normal, Salmon for out-of-range
  - Text: Off-white `#E6E6E6` on dark backgrounds
  - Borders: Subtle gray `#3C3C4F`

## How It Works

### Step 0: Welcome & Name Entry (Optional)
- Optionally enter your name to personalize tracking
- Access history directly from this screen
- Skip this step if preferred

### Step 1: Enter Your Information
- **Weight**: Input with independent unit selection (kg or lb)
- **Height**: Choose between:
  - Single input (cm or inches)
  - Feet & inches format (e.g., 5' 11")
- **Age** (optional): For enhanced analysis
- **Sex** (optional): For personalized insights
- All inputs support independent unit selection
- Click "Calculate BMI" to proceed

### Step 2: View Your Results
- **BMI Value**: Large, prominent display with gradient background
- **Category Badge**: Color-coded category indicator
- **BMI Interpretation**: Clear explanation of what your BMI means
- **Unit Conversion**: See your measurements in both metric and imperial
- **Options**:
  - View In-Depth Analysis (optional step)
  - Save & Skip to History (quick save)
  - Back to edit inputs

### Step 3: In-Depth Analysis (Optional)
- Detailed insights based on:
  - Age considerations (accuracy varies by age)
  - Sex differences (BMI correlates differently)
  - Muscle mass considerations
  - Body composition reminders
- Important considerations and limitations
- Can be skipped if not needed

### Step 4: History
- **View All Entries**: Chronological list of all saved calculations
- **Entry Details**: Date, time, BMI, category, measurements, and optional name
- **Quick Actions**:
  - Click any entry to view its in-depth analysis
  - Delete individual entries
  - Clear entire history
- **Data Storage Notice**: Warning about localStorage limitations
- **Add New**: Start a new calculation

## Technology Stack

- **HTML5**: Semantic markup structure with accessibility features
- **Tailwind CSS**: Utility-first CSS framework for responsive styling (via CDN)
- **Alpine.js**: Lightweight JavaScript framework for reactive UI (via CDN)
- **Vanilla JavaScript**: Core logic for BMI calculation and data management
- **localStorage API**: Browser-based data persistence

## Project Structure

```
bmi-app/
├── index.html          # Main HTML file with UI structure and dark theme
├── app.js              # JavaScript logic for BMI calculation, unit conversion, and data management
├── README.md           # This file
└── assets/             # Folder for future assets (images, icons, etc.)
```

## Getting Started

### Local Development

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required - it just works!

### Deployment

This is a fully static site that can be deployed to:

- **GitHub Pages**: 
  1. Push to a GitHub repository
  2. Enable GitHub Pages in repository settings
  3. Select the branch to deploy from

- **Vercel**:
  1. Connect your repository to Vercel
  2. Deploy with zero configuration

- **Any Static Hosting**: Upload the files to any web server that serves static files

## Data Storage

All BMI calculations are stored locally in your browser using the `localStorage` API. The data structure includes:

- Unique entry ID (timestamp-based)
- Timestamp
- Name (optional)
- Weight and height (with original units and format)
- Height format (single input or feet/inches)
- Age and sex (optional)
- Calculated BMI value
- BMI category
- In-depth insights (for later viewing)

### Important Data Storage Notes

⚠️ **Data Storage Warning**: Your BMI history is stored locally on your device. This means:

- Data may be lost if you clear your browser's cache or browsing data
- Data is only saved on this device and browser - it won't sync to other devices
- Using private/incognito mode may prevent data from being saved
- If you uninstall or reset your browser, all data will be permanently deleted
- Some browser extensions or security settings may clear this data automatically

**For important records, consider writing down your BMI results elsewhere or taking screenshots.**

**Privacy Note**: All data remains on your device. Nothing is transmitted to any server or third party.

## Unit Conversion

The app supports flexible unit input but standardizes all calculations to metric internally:

- **Weight**: Converts pounds (lb) to kilograms (kg) for calculation
- **Height**: Converts inches or feet/inches to centimeters (cm) for calculation
- **Display**: Shows results in both metric and imperial units for convenience

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript features
- localStorage API
- CSS Grid and Flexbox
- CSS Custom Properties (for theme colors)

Tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Accessibility Features

- ARIA labels on all form inputs and buttons
- Proper label associations with `for` attributes
- Skip link for keyboard navigation
- Semantic HTML structure with landmarks
- Focus indicators on interactive elements
- Error messages with `role="alert"`
- Keyboard navigation support throughout

## Color Scheme

The app uses a carefully designed dark theme:

- **Background**: `#1E1E2F` - Dark, non-black for reduced eye strain
- **Cards/Forms**: `#2A2A3D` - Slightly lighter for contrast
- **Primary Actions**: `#00B8D9` (Cyan) - Buttons and CTAs
- **Hover States**: `#00D4F5` - Lighter cyan for interactivity
- **Category Colors**:
  - Normal: `#00B8D9` (Cyan)
  - Out-of-range: `#FA8072` (Salmon)
- **Text**: `#E6E6E6` (Off-white) on dark backgrounds
- **Secondary Text**: `#B0B0B0` for hints and labels
- **Borders**: `#3C3C4F` - Subtle gray for separation

## Future Enhancements

Potential features for future versions:
- Advanced health metrics (waist circumference, activity level)
- BMI trend charts and graphs
- Export history to CSV/JSON
- Multiple user profiles
- Health recommendations based on BMI and additional metrics
- Customizable color themes
- Data export/import functionality

## License

This project is open source and available for personal and educational use.

## Contributing

Feel free to fork this project and submit pull requests for improvements!

---

**Disclaimer**: This BMI calculator is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a healthcare provider for personalized health guidance.
