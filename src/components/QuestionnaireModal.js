import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { colors } from '../constants/colors';

const QuestionnaireModal = ({ visible, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    mainGoal: '',
    trainingPreferences: [],
    hasInjury: false,
    injuryDetails: '',
    takesMedication: false,
    medicationDetails: '',
    disclaimerAccepted: false,
  });
  const [errors, setErrors] = useState({});

  const steps = [
    'Información Personal',
    'Objetivos',
    'Preferencias',
    'Salud',
    'Confirmación',
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentario' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'active', label: 'Activo' },
    { value: 'very_active', label: 'Muy Activo' },
  ];

  const mainGoals = [
    { value: 'lose_weight', label: 'Perder peso' },
    { value: 'gain_muscle', label: 'Ganar músculo (tonificar)' },
    { value: 'improve_fitness', label: 'Mejorar condición física (resistencia)' },
    { value: 'event_preparation', label: 'Preparar para un evento específico' },
    { value: 'rehabilitation', label: 'Rehabilitación' },
    { value: 'stay_active', label: 'Solo mantenerme activo/a' },
  ];

  const trainingPreferences = [
    { value: 'strength', label: 'Fuerza (pesas)' },
    { value: 'cardio', label: 'Cardio (correr, bici)' },
    { value: 'group_classes', label: 'Clases grupales (yoga, spinning, functional)' },
    { value: 'functional', label: 'Entrenamiento funcional' },
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleTrainingPreference = (value) => {
    const current = formData.trainingPreferences;
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFormData('trainingPreferences', updated);
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.age.trim()) newErrors.age = 'La edad es requerida';
        else if (isNaN(formData.age) || parseInt(formData.age) < 13 || parseInt(formData.age) > 100) {
          newErrors.age = 'Ingresa una edad válida';
        }
        if (!formData.weight.trim()) newErrors.weight = 'El peso es requerido';
        else if (isNaN(formData.weight) || parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300) {
          newErrors.weight = 'Ingresa un peso válido';
        }
        if (!formData.height.trim()) newErrors.height = 'La estatura es requerida';
        else if (isNaN(formData.height) || parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
          newErrors.height = 'Ingresa una estatura válida';
        }
        if (!formData.activityLevel) newErrors.activityLevel = 'Selecciona tu nivel de actividad';
        break;
      case 1:
        if (!formData.mainGoal) newErrors.mainGoal = 'Selecciona tu objetivo principal';
        break;
      case 2:
        if (formData.trainingPreferences.length === 0) {
          newErrors.trainingPreferences = 'Selecciona al menos una preferencia';
        }
        break;
      case 3:
        if (formData.hasInjury && !formData.injuryDetails.trim()) {
          newErrors.injuryDetails = 'Especifica tu lesión o condición médica';
        }
        if (formData.takesMedication && !formData.medicationDetails.trim()) {
          newErrors.medicationDetails = 'Especifica los medicamentos que tomas';
        }
        break;
      case 4:
        if (!formData.disclaimerAccepted) {
          newErrors.disclaimerAccepted = 'Debes aceptar la declaración de responsabilidad';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      onComplete(formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View>
            <Text style={styles.stepTitle}>Información Personal</Text>
            <CustomInput
              label="Edad"
              value={formData.age}
              onChangeText={(value) => updateFormData('age', value)}
              placeholder="25"
              keyboardType="numeric"
              error={errors.age}
            />
            <CustomInput
              label="Peso actual (kg)"
              value={formData.weight}
              onChangeText={(value) => updateFormData('weight', value)}
              placeholder="70"
              keyboardType="numeric"
              error={errors.weight}
            />
            <CustomInput
              label="Estatura (cm)"
              value={formData.height}
              onChangeText={(value) => updateFormData('height', value)}
              placeholder="170"
              keyboardType="numeric"
              error={errors.height}
            />
            <Text style={styles.sectionTitle}>Nivel de Actividad Actual</Text>
            {activityLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.optionButton,
                  formData.activityLevel === level.value && styles.selectedOption,
                ]}
                onPress={() => updateFormData('activityLevel', level.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.activityLevel === level.value && styles.selectedOptionText,
                  ]}
                >
                  {level.label}
                </Text>
                {formData.activityLevel === level.value && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            {errors.activityLevel && (
              <Text style={styles.errorText}>{errors.activityLevel}</Text>
            )}
          </View>
        );

      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Objetivos</Text>
            <Text style={styles.sectionTitle}>¿Cuál es tu principal objetivo?</Text>
            {mainGoals.map((goal) => (
              <TouchableOpacity
                key={goal.value}
                style={[
                  styles.optionButton,
                  formData.mainGoal === goal.value && styles.selectedOption,
                ]}
                onPress={() => updateFormData('mainGoal', goal.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.mainGoal === goal.value && styles.selectedOptionText,
                  ]}
                >
                  {goal.label}
                </Text>
                {formData.mainGoal === goal.value && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            {errors.mainGoal && (
              <Text style={styles.errorText}>{errors.mainGoal}</Text>
            )}
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Preferencias de Entrenamiento</Text>
            <Text style={styles.sectionTitle}>¿Qué tipo de entrenamiento prefieres?</Text>
            <Text style={styles.subtitle}>(Puedes seleccionar varios)</Text>
            {trainingPreferences.map((preference) => (
              <TouchableOpacity
                key={preference.value}
                style={[
                  styles.optionButton,
                  formData.trainingPreferences.includes(preference.value) && styles.selectedOption,
                ]}
                onPress={() => toggleTrainingPreference(preference.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.trainingPreferences.includes(preference.value) && styles.selectedOptionText,
                  ]}
                >
                  {preference.label}
                </Text>
                {formData.trainingPreferences.includes(preference.value) && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            {errors.trainingPreferences && (
              <Text style={styles.errorText}>{errors.trainingPreferences}</Text>
            )}
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Historial de Salud</Text>
            <Text style={styles.importantNote}>
              ¡MUY IMPORTANTE! - Para evitar riesgos
            </Text>
            
            <Text style={styles.sectionTitle}>
              ¿Tienes alguna lesión o condición médica que debamos conocer?
            </Text>
            <View style={styles.yesNoContainer}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  formData.hasInjury && styles.selectedYesNo,
                ]}
                onPress={() => updateFormData('hasInjury', true)}
              >
                <Text
                  style={[
                    styles.yesNoText,
                    formData.hasInjury && styles.selectedYesNoText,
                  ]}
                >
                  Sí
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  !formData.hasInjury && styles.selectedYesNo,
                ]}
                onPress={() => updateFormData('hasInjury', false)}
              >
                <Text
                  style={[
                    styles.yesNoText,
                    !formData.hasInjury && styles.selectedYesNoText,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>

            {formData.hasInjury && (
              <CustomInput
                label="Especifica tu lesión o condición médica"
                value={formData.injuryDetails}
                onChangeText={(value) => updateFormData('injuryDetails', value)}
                placeholder="Ej: lesión de rodilla, hernia discal, asma..."
                multiline
                numberOfLines={3}
                error={errors.injuryDetails}
              />
            )}

            <Text style={styles.sectionTitle}>
              ¿Tomas algún medicamento regularmente?
            </Text>
            <View style={styles.yesNoContainer}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  formData.takesMedication && styles.selectedYesNo,
                ]}
                onPress={() => updateFormData('takesMedication', true)}
              >
                <Text
                  style={[
                    styles.yesNoText,
                    formData.takesMedication && styles.selectedYesNoText,
                  ]}
                >
                  Sí
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  !formData.takesMedication && styles.selectedYesNo,
                ]}
                onPress={() => updateFormData('takesMedication', false)}
              >
                <Text
                  style={[
                    styles.yesNoText,
                    !formData.takesMedication && styles.selectedYesNoText,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>

            {formData.takesMedication && (
              <CustomInput
                label="Especifica los medicamentos"
                value={formData.medicationDetails}
                onChangeText={(value) => updateFormData('medicationDetails', value)}
                placeholder="Ej: medicamento para la presión, insulina..."
                multiline
                numberOfLines={3}
                error={errors.medicationDetails}
              />
            )}
          </View>
        );

      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>Confirmación</Text>
            <Text style={styles.sectionTitle}>Declaración de exoneración de responsabilidad</Text>
            
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                "Confirmo que he respondido estas preguntas con veracidad y que es recomendable consultar con un médico antes de comenzar cualquier nuevo programa de ejercicio."
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => updateFormData('disclaimerAccepted', !formData.disclaimerAccepted)}
            >
              <View style={[
                styles.checkbox,
                formData.disclaimerAccepted && styles.checkedBox,
              ]}>
                {formData.disclaimerAccepted && (
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                )}
              </View>
              <Text style={styles.checkboxText}>
                Acepto la declaración de responsabilidad
              </Text>
            </TouchableOpacity>
            {errors.disclaimerAccepted && (
              <Text style={styles.errorText}>{errors.disclaimerAccepted}</Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Paso {currentStep + 1} de {steps.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentStep + 1) / steps.length) * 100}%` },
                ]}
              />
            </View>
          </View>
          <Text style={styles.stepIndicator}>{steps[currentStep]}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <CustomButton
                title="Anterior"
                onPress={handlePrevious}
                variant="outline"
                style={styles.previousButton}
              />
            )}
            <CustomButton
              title={currentStep === steps.length - 1 ? 'Completar' : 'Siguiente'}
              onPress={handleNext}
              style={styles.nextButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepIndicator: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  importantNote: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    fontSize: 16,
    color: colors.black,
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  yesNoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  yesNoButton: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.lightGray,
    alignItems: 'center',
  },
  selectedYesNo: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  yesNoText: {
    fontSize: 16,
    color: colors.black,
  },
  selectedYesNoText: {
    color: colors.primary,
    fontWeight: '600',
  },
  disclaimerContainer: {
    backgroundColor: colors.lightGray + '50',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 5,
  },
  footer: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previousButton: {
    flex: 0.45,
  },
  nextButton: {
    flex: 0.45,
  },
});

export default QuestionnaireModal;
