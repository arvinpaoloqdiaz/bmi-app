// BMI Calculator App - Main Logic
function bmiApp() {
    return {
        currentStep: 0,
        totalSteps: 4,
        viewingEntry: null, // Entry being viewed for analysis
        weightUnit: 'kg', // 'kg' or 'lb'
        heightUnit: 'cm', // 'cm' or 'in'
        heightFormat: 'single', // 'single' or 'feet-inches'
        formData: {
            name: '',
            weight: '',
            height: '',
            heightFeet: '',
            heightInches: '',
            age: '',
            sex: ''
        },
        result: {
            bmi: 0,
            category: '',
            interpretation: '',
            insights: []
        },
        history: [],
        errors: {
            weight: '',
            height: ''
        },
        dismissedWarning: false,

        // Dismiss warning and save preference
        dismissWarning() {
            this.dismissedWarning = true;
            try {
                localStorage.setItem('dismissedWarning', 'true');
            } catch (e) {
                console.error('Error saving warning preference:', e);
            }
        },

        // Navigate to a specific step
        goToStep(step) {
            if (step >= 0 && step <= this.totalSteps) {
                this.currentStep = step;
                // Clear viewing entry when navigating away from analysis (step 3)
                if (step !== 3) {
                    this.viewingEntry = null;
                }
            }
        },

        // Validate form inputs
        validateForm() {
            this.errors = { weight: '', height: '' };
            let isValid = true;

            // Validate weight
            const weight = parseFloat(this.formData.weight);
            if (!this.formData.weight || isNaN(weight) || weight <= 0) {
                this.errors.weight = 'Please enter a valid weight greater than 0';
                isValid = false;
            }

            // Validate height based on format
            if (this.heightFormat === 'single') {
                const height = parseFloat(this.formData.height);
                if (!this.formData.height || isNaN(height) || height <= 0) {
                    this.errors.height = 'Please enter a valid height greater than 0';
                    isValid = false;
                }
            } else {
                // Validate feet and inches
                const feet = parseInt(this.formData.heightFeet) || 0;
                const inches = parseInt(this.formData.heightInches) || 0;
                if (feet <= 0 && inches <= 0) {
                    this.errors.height = 'Please enter a valid height (feet and/or inches)';
                    isValid = false;
                } else if (feet < 0 || inches < 0 || inches >= 12) {
                    this.errors.height = 'Please enter valid values (feet ≥ 0, inches 0-11)';
                    isValid = false;
                }
            }

            return isValid;
        },

        // Convert weight to metric (kg)
        convertWeightToMetric(weight, unit) {
            if (unit === 'lb') {
                // Convert pounds to kg: 1 lb = 0.453592 kg
                return weight * 0.453592;
            }
            return weight; // Already in kg
        },

        // Convert height to metric (cm)
        convertHeightToMetric(height, unit) {
            if (unit === 'in') {
                // Convert inches to cm: 1 in = 2.54 cm
                return height * 2.54;
            }
            return height; // Already in cm
        },

        // Get height in cm from form data
        getHeightInCm() {
            if (this.heightFormat === 'single') {
                const height = parseFloat(this.formData.height);
                return this.convertHeightToMetric(height, this.heightUnit);
            } else {
                // Convert feet and inches to total inches, then to cm
                const feet = parseInt(this.formData.heightFeet) || 0;
                const inches = parseInt(this.formData.heightInches) || 0;
                const totalInches = (feet * 12) + inches;
                return this.convertHeightToMetric(totalInches, 'in');
            }
        },

        // Calculate BMI
        calculateBMI() {
            if (!this.validateForm()) {
                return;
            }

            // Get weight and height, converting to metric
            let weight = parseFloat(this.formData.weight);
            weight = this.convertWeightToMetric(weight, this.weightUnit);
            
            const height = this.getHeightInCm();

            // BMI formula: weight (kg) / height (m)²
            // Height is in cm, so convert to meters
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);

            // Determine category
            let category = '';
            let interpretation = '';

            if (bmi < 18.5) {
                category = 'Underweight';
                interpretation = 'Your BMI indicates you are underweight. Consider consulting with a healthcare provider about healthy ways to gain weight.';
            } else if (bmi >= 18.5 && bmi < 25) {
                category = 'Normal';
                interpretation = 'Your BMI is within the normal range. Keep up the good work with a balanced diet and regular exercise!';
            } else if (bmi >= 25 && bmi < 30) {
                category = 'Overweight';
                interpretation = 'Your BMI indicates you are overweight. Consider adopting a balanced diet and regular physical activity to improve your health.';
            } else {
                category = 'Obese';
                interpretation = 'Your BMI indicates obesity. It\'s recommended to consult with a healthcare provider to develop a personalized health plan.';
            }

            // Generate in-depth insights
            const insights = this.generateInsights(bmi);

            // Calculate weight needed to reach normal BMI
            const weightCalculations = this.calculateWeightForNormalBMI(bmi, weight, heightInMeters);
            
            // Calculate height change needed (theoretical)
            const heightCalculations = this.calculateHeightForNormalBMI(bmi, weight, heightInMeters);

            // Store result
            this.result = {
                bmi: bmi,
                category: category,
                interpretation: interpretation,
                insights: insights,
                weightCalculations: weightCalculations,
                heightCalculations: heightCalculations
            };

            // Move to result step
            this.goToStep(2);
        },

        // Save result and skip to history
        saveAndSkipToHistory() {
            this.saveResult();
            // saveResult() already moves to step 4 (history), so we don't need to do anything else
        },

        // Calculate weight needed to reach normal BMI range
        calculateWeightForNormalBMI(currentBMI, currentWeightKg, heightInMeters) {
            // Normal BMI range is 18.5 to 24.9
            // Calculate target weight for both ends of the range
            const targetWeightMin = 18.5 * (heightInMeters * heightInMeters);
            const targetWeightMax = 24.9 * (heightInMeters * heightInMeters);
            
            let result = {
                needsChange: false,
                weightChange: 0,
                targetWeight: currentWeightKg,
                targetBMI: currentBMI,
                direction: '' // 'gain' or 'lose'
            };

            if (currentBMI < 18.5) {
                // Underweight - need to gain to reach 18.5
                result.needsChange = true;
                result.weightChange = targetWeightMin - currentWeightKg;
                result.targetWeight = targetWeightMin;
                result.targetBMI = 18.5;
                result.direction = 'gain';
            } else if (currentBMI > 24.9) {
                // Overweight/Obese - need to lose to reach 24.9
                result.needsChange = true;
                result.weightChange = currentWeightKg - targetWeightMax;
                result.targetWeight = targetWeightMax;
                result.targetBMI = 24.9;
                result.direction = 'lose';
            }
            // If BMI is already normal (18.5-24.9), no change needed

            return result;
        },

        // Calculate height change needed to reach normal BMI (theoretical)
        calculateHeightForNormalBMI(currentBMI, currentWeightKg, currentHeightMeters) {
            // Normal BMI range is 18.5 to 24.9
            let result = {
                needsChange: false,
                heightChange: 0,
                targetHeight: currentHeightMeters,
                targetBMI: currentBMI,
                direction: '' // 'increase' or 'decrease'
            };

            if (currentBMI < 18.5) {
                // Underweight - would need to decrease height (theoretical, not practical)
                const targetHeight = Math.sqrt(currentWeightKg / 18.5);
                result.needsChange = true;
                result.heightChange = currentHeightMeters - targetHeight;
                result.targetHeight = targetHeight;
                result.targetBMI = 18.5;
                result.direction = 'decrease';
            } else if (currentBMI > 24.9) {
                // Overweight/Obese - would need to increase height (theoretical, not practical)
                const targetHeight = Math.sqrt(currentWeightKg / 24.9);
                result.needsChange = true;
                result.heightChange = targetHeight - currentHeightMeters;
                result.targetHeight = targetHeight;
                result.targetBMI = 24.9;
                result.direction = 'increase';
            }

            return result;
        },

        // Generate in-depth insights based on BMI, age, and sex
        generateInsights(bmi) {
            const insights = [];
            const age = this.formData.age ? parseInt(this.formData.age) : null;
            const sex = this.formData.sex;

            // Age-related insights
            if (age !== null) {
                if (age >= 65) {
                    insights.push({
                        title: 'Age Consideration',
                        text: 'BMI accuracy decreases with advancing age. The relationship between BMI and body fatness weakens in older adults. Consider consulting with a healthcare provider for age-appropriate health assessments.'
                    });
                } else if (age < 18) {
                    insights.push({
                        title: 'Age Consideration',
                        text: 'BMI interpretation for children and adolescents differs from adults. Age and sex-specific BMI percentiles should be used for accurate assessment. Consult with a pediatrician for proper evaluation.'
                    });
                }
            }

            // Sex-related insights
            if (sex) {
                if (sex === 'male') {
                    insights.push({
                        title: 'Sex-Specific Consideration',
                        text: 'BMI shows slightly weaker correlation with body fatness in men compared to women. Men typically have higher muscle mass, which can affect BMI interpretation. Consider body composition analysis for a more accurate assessment.'
                    });
                } else if (sex === 'female') {
                    insights.push({
                        title: 'Sex-Specific Consideration',
                        text: 'BMI correlates more strongly with body fatness in women. However, body fat distribution (visceral vs. subcutaneous) is also important for health assessment. Waist circumference measurements can provide additional insights.'
                    });
                }
            }

            // Muscle mass consideration for higher BMIs
            if (bmi >= 25) {
                insights.push({
                    title: 'Muscle Mass Consideration',
                    text: 'BMI cannot distinguish between muscle and fat. If you are physically active or athletic, your higher BMI may reflect increased muscle mass rather than excess body fat. Consider body composition analysis for a more accurate assessment.'
                });
            }

            // Body composition reminder
            insights.push({
                title: 'Body Composition',
                text: 'BMI is a screening tool and does not account for muscle mass, bone density, or fat distribution. For a complete health picture, consider additional metrics like waist circumference, body fat percentage, and waist-to-hip ratio.'
            });

            return insights;
        },

        // Get CSS class for category badge
        getCategoryClass(category) {
            const classes = {
                'Underweight': 'salmon-badge',
                'Normal': 'cyan-badge', // Cyan for normal as specified
                'Overweight': 'salmon-badge',
                'Obese': 'salmon-badge'
            };
            return classes[category] || 'gray-badge';
        },

        // Save result to localStorage
        saveResult() {
            // Get display values for weight and height
            let weightDisplay = parseFloat(this.formData.weight);
            let heightDisplay = '';
            let weightUnitDisplay = this.weightUnit;
            let heightUnitDisplay = this.heightUnit;

            if (this.heightFormat === 'single') {
                heightDisplay = parseFloat(this.formData.height);
            } else {
                // Store as total inches for display
                const feet = parseInt(this.formData.heightFeet) || 0;
                const inches = parseInt(this.formData.heightInches) || 0;
                heightDisplay = (feet * 12) + inches;
                heightUnitDisplay = 'in';
            }

            const entry = {
                id: this.generateId(),
                timestamp: Date.now(),
                name: this.formData.name ? this.formData.name.trim() : null,
                weight: weightDisplay,
                height: heightDisplay,
                heightFormat: this.heightFormat,
                heightFeet: this.heightFormat === 'feet-inches' ? parseInt(this.formData.heightFeet) || 0 : null,
                heightInches: this.heightFormat === 'feet-inches' ? parseInt(this.formData.heightInches) || 0 : null,
                weightUnit: weightUnitDisplay,
                heightUnit: heightUnitDisplay,
                age: this.formData.age ? parseInt(this.formData.age) : null,
                sex: this.formData.sex || null,
                bmi: this.result.bmi,
                category: this.result.category,
                insights: this.result.insights, // Store insights with entry
                weightCalculations: this.result.weightCalculations, // Store weight calculations
                heightCalculations: this.result.heightCalculations // Store height calculations
            };

            // Add to history array
            this.history.unshift(entry); // Add to beginning of array

            // Save to localStorage
            try {
                localStorage.setItem('bmiHistory', JSON.stringify(this.history));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                alert('Unable to save result. Your browser may not support localStorage or it may be full.');
                return;
            }

            // Move to history step
            this.goToStep(4);
        },

        // Delete individual entry from history
        deleteEntry(entryId) {
            if (confirm('Are you sure you want to delete this BMI entry? This action cannot be undone.')) {
                // Remove entry from history array
                this.history = this.history.filter(entry => entry.id !== entryId);

                // Save updated history to localStorage
                try {
                    localStorage.setItem('bmiHistory', JSON.stringify(this.history));
                } catch (e) {
                    console.error('Error saving to localStorage:', e);
                    alert('Unable to update history. Your browser may not support localStorage or it may be full.');
                    return;
                }
            }
        },

        // Generate unique ID for entry
        generateId() {
            const now = new Date();
            const dateStr = now.getFullYear().toString() +
                          (now.getMonth() + 1).toString().padStart(2, '0') +
                          now.getDate().toString().padStart(2, '0');
            const timeStr = now.getHours().toString().padStart(2, '0') +
                          now.getMinutes().toString().padStart(2, '0') +
                          now.getSeconds().toString().padStart(2, '0');
            return dateStr + '_' + timeStr;
        },

        // Load history from localStorage
        loadHistory() {
            try {
                const stored = localStorage.getItem('bmiHistory');
                if (stored) {
                    this.history = JSON.parse(stored);
                    // Sort by timestamp (newest first)
                    this.history.sort((a, b) => b.timestamp - a.timestamp);
                }
                // Load dismissed warning preference
                const dismissed = localStorage.getItem('dismissedWarning');
                if (dismissed === 'true') {
                    this.dismissedWarning = true;
                }
            } catch (e) {
                console.error('Error loading history from localStorage:', e);
                this.history = [];
            }
        },

        // Clear all history
        clearHistory() {
            if (confirm('Are you sure you want to clear all BMI history? This action cannot be undone.')) {
                this.history = [];
                try {
                    localStorage.removeItem('bmiHistory');
                } catch (e) {
                    console.error('Error clearing localStorage:', e);
                }
            }
        },

        // Format date for display
        formatDate(timestamp) {
            const date = new Date(timestamp);
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('en-US', options);
        },

        // Format height for display in history
        formatHeight(entry) {
            if (entry.heightFormat === 'feet-inches') {
                return entry.heightFeet + "' " + entry.heightInches + '"';
            } else {
                return entry.height + ' ' + (entry.heightUnit || 'cm');
            }
        },

        // Format weight in metric (kg)
        formatWeightMetric() {
            let weight, unit;
            if (this.viewingEntry) {
                // When viewing an entry, use entry data
                weight = this.viewingEntry.weight;
                unit = this.viewingEntry.weightUnit || 'kg';
            } else {
                // When viewing current calculation
                weight = parseFloat(this.formData.weight);
                unit = this.weightUnit;
            }
            
            if (unit === 'lb') {
                weight = this.convertWeightToMetric(weight, 'lb');
            }
            return weight.toFixed(1) + ' kg';
        },

        // Format weight in imperial (lb)
        formatWeightImperial() {
            let weight, unit;
            if (this.viewingEntry) {
                // When viewing an entry, use entry data
                weight = this.viewingEntry.weight;
                unit = this.viewingEntry.weightUnit || 'kg';
            } else {
                // When viewing current calculation
                weight = parseFloat(this.formData.weight);
                unit = this.weightUnit;
            }
            
            if (unit === 'kg') {
                // Convert kg to lb: 1 kg = 2.20462 lb
                weight = weight * 2.20462;
            }
            return weight.toFixed(1) + ' lb';
        },

        // Format height in metric (cm)
        formatHeightMetric() {
            let heightCm;
            if (this.viewingEntry) {
                // When viewing an entry, reconstruct height in cm
                if (this.viewingEntry.heightFormat === 'feet-inches') {
                    const totalInches = (this.viewingEntry.heightFeet * 12) + this.viewingEntry.heightInches;
                    heightCm = this.convertHeightToMetric(totalInches, 'in');
                } else {
                    const height = this.viewingEntry.height;
                    heightCm = this.convertHeightToMetric(height, this.viewingEntry.heightUnit || 'cm');
                }
            } else {
                // When viewing current calculation
                heightCm = this.getHeightInCm();
            }
            return heightCm.toFixed(1) + ' cm';
        },

        // Format weight change needed
        formatWeightChange(weightChangeKg, direction, weightUnit) {
            if (!weightChangeKg || weightChangeKg <= 0) return '';
            
            let weightChange = weightChangeKg;
            if (weightUnit === 'lb') {
                weightChange = weightChangeKg * 2.20462; // Convert to pounds
            }
            
            const formatted = weightChange.toFixed(1);
            const unit = weightUnit === 'lb' ? 'lb' : 'kg';
            
            return `${formatted} ${unit}`;
        },

        // Format target weight
        formatTargetWeight(targetWeightKg, weightUnit) {
            let targetWeight = targetWeightKg;
            if (weightUnit === 'lb') {
                targetWeight = targetWeightKg * 2.20462;
            }
            const unit = weightUnit === 'lb' ? 'lb' : 'kg';
            return `${targetWeight.toFixed(1)} ${unit}`;
        },

        // Format height change needed (theoretical)
        formatHeightChange(heightChangeCm, direction, heightUnit, heightFormat) {
            if (!heightChangeCm || Math.abs(heightChangeCm) < 0.1) return '';
            
            let displayValue = '';
            if (heightFormat === 'feet-inches' || heightUnit === 'in') {
                // Convert to inches
                const heightChangeInches = Math.abs(heightChangeCm) * 0.393701;
                const feet = Math.floor(heightChangeInches / 12);
                const inches = Math.round(heightChangeInches % 12);
                
                if (feet > 0) {
                    displayValue = `${feet}' ${inches}"`;
                } else {
                    displayValue = `${inches}"`;
                }
            } else {
                // Display in cm
                displayValue = `${Math.abs(heightChangeCm).toFixed(1)} cm`;
            }
            
            return displayValue;
        },

        // Format target height
        formatTargetHeight(targetHeightMeters, heightUnit, heightFormat) {
            const targetHeightCm = targetHeightMeters * 100;
            
            if (heightFormat === 'feet-inches' || heightUnit === 'in') {
                const totalInches = targetHeightCm * 0.393701;
                const feet = Math.floor(totalInches / 12);
                const inches = Math.round(totalInches % 12);
                return `${feet}' ${inches}"`;
            } else {
                return `${targetHeightCm.toFixed(1)} cm`;
            }
        },

        // Format height in imperial (feet and inches, or inches only)
        formatHeightImperial() {
            let heightCm;
            if (this.viewingEntry) {
                // When viewing an entry, reconstruct height in cm
                if (this.viewingEntry.heightFormat === 'feet-inches') {
                    const totalInches = (this.viewingEntry.heightFeet * 12) + this.viewingEntry.heightInches;
                    heightCm = this.convertHeightToMetric(totalInches, 'in');
                } else {
                    const height = this.viewingEntry.height;
                    heightCm = this.convertHeightToMetric(height, this.viewingEntry.heightUnit || 'cm');
                }
            } else {
                // When viewing current calculation
                heightCm = this.getHeightInCm();
            }
            
            // Convert cm to inches: 1 cm = 0.393701 in
            const totalInches = heightCm * 0.393701;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            
            if (feet > 0) {
                return feet + "' " + inches + '"';
            } else {
                return inches + ' in';
            }
        },

        // View in-depth analysis for a specific history entry
        viewEntryAnalysis(entry) {
            this.viewingEntry = entry;
            
            // Reconstruct height and weight for calculations
            let heightCm, weightKg;
            if (entry.heightFormat === 'feet-inches') {
                const totalInches = (entry.heightFeet * 12) + entry.heightInches;
                heightCm = this.convertHeightToMetric(totalInches, 'in');
            } else {
                heightCm = this.convertHeightToMetric(entry.height, entry.heightUnit || 'cm');
            }
            weightKg = this.convertWeightToMetric(entry.weight, entry.weightUnit || 'kg');
            const heightInMeters = heightCm / 100;
            
            // Recalculate weight and height adjustments
            const weightCalculations = this.calculateWeightForNormalBMI(entry.bmi, weightKg, heightInMeters);
            const heightCalculations = this.calculateHeightForNormalBMI(entry.bmi, weightKg, heightInMeters);
            
            // Reconstruct result object from entry
            this.result = {
                bmi: entry.bmi,
                category: entry.category,
                interpretation: this.getInterpretationForBMI(entry.bmi),
                insights: entry.insights || this.generateInsightsForEntry(entry),
                weightCalculations: weightCalculations,
                heightCalculations: heightCalculations
            };
            // Reconstruct form data for unit display
            this.formData.weight = entry.weight;
            this.formData.height = entry.heightFormat === 'feet-inches' ? null : entry.height;
            this.formData.heightFeet = entry.heightFeet || '';
            this.formData.heightInches = entry.heightInches || '';
            this.weightUnit = entry.weightUnit || 'kg';
            this.heightUnit = entry.heightUnit || 'cm';
            this.heightFormat = entry.heightFormat || 'single';
            
            // Go to step 3 (in-depth analysis)
            this.goToStep(3);
        },

        // Get interpretation text for a given BMI
        getInterpretationForBMI(bmi) {
            if (bmi < 18.5) {
                return 'Your BMI indicates you are underweight. Consider consulting with a healthcare provider about healthy ways to gain weight.';
            } else if (bmi >= 18.5 && bmi < 25) {
                return 'Your BMI is within the normal range. Keep up the good work with a balanced diet and regular exercise!';
            } else if (bmi >= 25 && bmi < 30) {
                return 'Your BMI indicates you are overweight. Consider adopting a balanced diet and regular physical activity to improve your health.';
            } else {
                return 'Your BMI indicates obesity. It\'s recommended to consult with a healthcare provider to develop a personalized health plan.';
            }
        },

        // Generate insights for a history entry
        generateInsightsForEntry(entry) {
            const insights = [];
            const age = entry.age;
            const sex = entry.sex;
            const bmi = entry.bmi;

            // Age-related insights
            if (age !== null) {
                if (age >= 65) {
                    insights.push({
                        title: 'Age Consideration',
                        text: 'BMI accuracy decreases with advancing age. The relationship between BMI and body fatness weakens in older adults. Consider consulting with a healthcare provider for age-appropriate health assessments.'
                    });
                } else if (age < 18) {
                    insights.push({
                        title: 'Age Consideration',
                        text: 'BMI interpretation for children and adolescents differs from adults. Age and sex-specific BMI percentiles should be used for accurate assessment. Consult with a pediatrician for proper evaluation.'
                    });
                }
            }

            // Sex-related insights
            if (sex) {
                if (sex === 'male') {
                    insights.push({
                        title: 'Sex-Specific Consideration',
                        text: 'BMI shows slightly weaker correlation with body fatness in men compared to women. Men typically have higher muscle mass, which can affect BMI interpretation. Consider body composition analysis for a more accurate assessment.'
                    });
                } else if (sex === 'female') {
                    insights.push({
                        title: 'Sex-Specific Consideration',
                        text: 'BMI correlates more strongly with body fatness in women. However, body fat distribution (visceral vs. subcutaneous) is also important for health assessment. Waist circumference measurements can provide additional insights.'
                    });
                }
            }

            // Muscle mass consideration for higher BMIs
            if (bmi >= 25) {
                insights.push({
                    title: 'Muscle Mass Consideration',
                    text: 'BMI cannot distinguish between muscle and fat. If you are physically active or athletic, your higher BMI may reflect increased muscle mass rather than excess body fat. Consider body composition analysis for a more accurate assessment.'
                });
            }

            // Body composition reminder
            insights.push({
                title: 'Body Composition',
                text: 'BMI is a screening tool and does not account for muscle mass, bone density, or fat distribution. For a complete health picture, consider additional metrics like waist circumference, body fat percentage, and waist-to-hip ratio.'
            });

            return insights;
        },

        // Reset form to start over
        resetForm() {
            this.currentStep = 0;
            this.viewingEntry = null;
            this.formData = {
                name: '',
                weight: '',
                height: '',
                heightFeet: '',
                heightInches: '',
                age: '',
                sex: ''
            };
            this.result = {
                bmi: 0,
                category: '',
                interpretation: '',
                insights: [],
                weightCalculations: null,
                heightCalculations: null
            };
            this.errors = {
                weight: '',
                height: ''
            };
            // Reload history in case it was updated
            this.loadHistory();
        }
    };
}
