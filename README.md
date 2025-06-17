# CO Logging App

A React-based web application for tracking and monitoring the carbon footprint of various machinery and equipment. The application features a login wall and uses YAML-driven form configuration for easy customization.

## Features

- 🔐 **Login Wall**: Secure authentication system with role-based access
- 📊 **Carbon Footprint Tracking**: Log and calculate CO₂ emissions for different equipment
- ⚙️ **YAML-Driven Forms**: Easily customize form structure by editing a YAML configuration file
- 📱 **Responsive Design**: Modern, glassmorphism-inspired UI that works on all devices
- 💾 **Local Storage**: Automatically saves submissions locally for persistence
- 🧮 **Real-time Calculations**: Automatic carbon footprint calculations based on usage data
- 🔄 **Conditional Fields**: Smart form fields that show/hide based on other selections

## Demo Credentials

The application comes with three demo user accounts:

- **Administrator**: `admin` / `admin123`
- **Equipment Operator**: `operator` / `op123`
- **Site Manager**: `manager` / `mgr123`

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

4. **Login** with one of the demo credentials above

## Configuration

### Customizing the Form

The entire form structure is controlled by the `public/form-config.yaml` file. You can easily modify this file to:

- Add new equipment types
- Change form sections and fields
- Modify validation rules
- Update carbon footprint calculation factors
- Add conditional field logic

#### Example YAML Structure:

```yaml
title: "Carbon Footprint Equipment Logger"
description: "Track and monitor the carbon footprint of various machinery and equipment"

sections:
  - name: "Equipment Information"
    description: "Basic information about the equipment"
    fields:
      - name: "equipmentType"
        label: "Equipment Type"
        type: "select"
        required: true
        options:
          - value: "excavator"
            label: "Excavator"
          - value: "crane"
            label: "Crane"
      
      - name: "fuelConsumption"
        label: "Fuel Consumption"
        type: "number"
        required: true
        min: 0
        step: 0.1
        conditionalShow:
          field: "fuelType"
          values: ["diesel", "gasoline"]

calculations:
  emissionFactors:
    diesel: 2.68  # kg CO2 per liter
    gasoline: 2.31  # kg CO2 per liter
```

### Supported Field Types

- `text` - Single line text input
- `number` - Numeric input with optional min/max/step
- `date` - Date picker
- `select` - Dropdown selection
- `textarea` - Multi-line text input

### Conditional Fields

Fields can be shown/hidden based on the values of other fields using the `conditionalShow` property:

```yaml
conditionalShow:
  field: "fuelType"
  values: ["diesel", "gasoline"]
```

## Project Structure

```
src/
├── components/
│   ├── DynamicForm.jsx     # Main form component
│   ├── Header.jsx          # Application header
│   └── LoginForm.jsx       # Authentication form
├── context/
│   └── AuthContext.jsx     # Authentication state management
├── hooks/
│   └── useFormConfig.js    # YAML configuration loader
├── config/
│   └── form-config.yaml    # Form configuration (backup)
├── App.jsx                 # Main application component
├── main.jsx               # React entry point
└── index.css              # Global styles

public/
└── form-config.yaml       # Main form configuration file
```

## Carbon Footprint Calculations

The application calculates carbon emissions based on:

1. **Base Emission Factors**: CO₂ per unit of fuel/energy consumed
2. **Operating Conditions**: Multipliers for light/normal/heavy/extreme conditions
3. **Operation Hours**: Total runtime of the equipment
4. **Fuel/Energy Consumption**: Amount consumed during operation

Formula: `Emissions = Consumption × Emission Factor × Condition Multiplier × Hours`

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **js-yaml** - YAML parsing
- **lucide-react** - Modern icons
- **styled-components** - CSS-in-JS styling
- **react-hook-form** - Form handling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Adding New Equipment Types

1. Edit `public/form-config.yaml`
2. Add new options to the `equipmentType` field
3. Optionally add specific fields for the new equipment type
4. Update emission factors if needed

### Modifying Authentication

The authentication system uses a simple in-memory store with localStorage persistence. For production use, you would replace the `AuthContext` with a real authentication service.

### Styling

The application uses a glassmorphism design with CSS custom properties. Main colors and styles are defined in `src/index.css` and can be easily customized.

## Data Storage

Currently, the application stores all data in the browser's localStorage. For production use, you would want to integrate with a backend API for proper data persistence and user management.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please refer to the documentation or create an issue in the repository.