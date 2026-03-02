import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateAnswerKey() {
  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (!subject) {
      Alert.alert('Error', 'Please enter a subject name');
      return;
    }
    if (!numQuestions || parseInt(numQuestions) < 1) {
      Alert.alert('Error', 'Please enter a valid number of questions');
      return;
    }
    setAnswers(new Array(parseInt(numQuestions)).fill(''));
    setStep(2);
  };

  const selectAnswer = (index: number, option: string) => {
    const updated = [...answers];
    updated[index] = option;
    setAnswers(updated);
  };

  const handleSave = () => {
    if (answers.includes('')) {
      Alert.alert('Error', 'Please select an answer for all questions');
      return;
    }
    Alert.alert('Success', 'Answer key saved successfully!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Answer Key</Text>
      </View>

      {step === 1 ? (
        <View style={styles.body}>
          <Text style={styles.label}>Subject Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mathematics"
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>Number of Questions</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 20"
            keyboardType="numeric"
            value={numQuestions}
            onChangeText={setNumQuestions}
          />

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Subject: {subject}</Text>
          <Text style={styles.sectionSubtitle}>Select correct answer for each question</Text>

          {answers.map((answer, index) => (
            <View key={index} style={styles.questionRow}>
              <Text style={styles.questionNumber}>Q{index + 1}</Text>
              {['A', 'B', 'C', 'D'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    answer === option && styles.optionSelected
                  ]}
                  onPress={() => selectAnswer(index, option)}
                >
                  <Text style={[
                    styles.optionText,
                    answer === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Answer Key</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EEF2FF',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  body: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 40,
  },
  optionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  optionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  optionTextSelected: {
    color: '#fff',
  },
});