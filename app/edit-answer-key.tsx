import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function EditAnswerKey() {
  const { id } = useLocalSearchParams();
  const [subject, setSubject] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnswerKey();
  }, []);

  const fetchAnswerKey = async () => {
    try {
      const docRef = doc(db, 'answerKeys', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSubject(data.subject);
        setAnswers(data.answers);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (index: number, option: string) => {
    const updated = [...answers];
    updated[index] = option;
    setAnswers(updated);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'answerKeys', id as string);
      await updateDoc(docRef, { answers });
      Alert.alert('Success', 'Answer key updated!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit: {subject}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionSubtitle}>Tap to change any answer</Text>

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
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
});