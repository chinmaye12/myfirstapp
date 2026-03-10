import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

type AnswerKey = {
  id: string;
  subject: string;
  numQuestions: number;
  answers: string[];
};

export default function ScanOMR() {
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [answerKeys, setAnswerKeys] = useState<AnswerKey[]>([]);
  const [selectedKey, setSelectedKey] = useState<AnswerKey | null>(null);
  const [step, setStep] = useState(1);

  const fetchAnswerKeys = async () => {
    try {
      const user = auth.currentUser;
      const q = query(
        collection(db, 'answerKeys'),
        where('teacherId', '==', user?.uid)
      );
      const querySnapshot = await getDocs(q);
      const keys: AnswerKey[] = [];
      querySnapshot.forEach((doc) => {
        keys.push({ id: doc.id, ...doc.data() } as AnswerKey);
      });
      setAnswerKeys(keys);
      setStep(2);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
      setStep(4);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
      setStep(4);
    }
  };

  const scanOMR = async () => {
    if (!imageBase64 || !selectedKey) {
      Alert.alert('Error', 'No image or answer key selected');
      return;
    }
    setScanning(true);

    try {
      const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

      if (!apiKey) {
        Alert.alert('Error', 'API key not found');
        return;
      }

      console.log('Calling Groq API...');

      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Analyze this OMR answer sheet image carefully.
Each question has 4 circles in order: 1st circle = A, 2nd circle = B, 3rd circle = C, 4th circle = D.
The circles may or may not have letters inside them.
One circle per question is filled completely solid black - that is the selected answer.
The sheet may have questions arranged in one or two columns.
Scan every question from the first to the last in order.
For each question identify which circle is filled solid black and return the corresponding letter.
Return ONLY a raw JSON array with exactly ${selectedKey.numQuestions} letters.
No explanation, no markdown, no extra text.`
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:image/jpeg;base64,${imageBase64}`
                    }
                  }
                ]
              }
            ],
            max_tokens: 500
          })
        }
      );

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data));

      if (data.error) {
        Alert.alert('API Error', data.error.message);
        return;
      }

      const text = data.choices[0].message.content;
      console.log('Detected text:', text);

      const cleanText = text.replace(/```json|```/g, '').trim();
      const detectedAnswers = JSON.parse(cleanText);

      let correct = 0;
      const comparison = selectedKey.answers.map((answer, index) => {
        const detected = detectedAnswers[index];
        const isCorrect = answer === detected;
        if (isCorrect) correct++;
        return { question: index + 1, correct: answer, detected, isCorrect };
      });

      setResult({
        score: correct,
        total: selectedKey.numQuestions,
        percentage: Math.round((correct / selectedKey.numQuestions) * 100),
        comparison
      });
      setStep(5);

    } catch (error: any) {
      console.log('Error details:', error);
      Alert.alert('Error', error.message || 'Failed to scan. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan OMR Sheet</Text>
      </View>

      <View style={styles.body}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Ionicons name="scan-outline" size={80} color="#3B82F6" />
            <Text style={styles.stepTitle}>Scan OMR Sheet</Text>
            <Text style={styles.stepSubtitle}>First select the answer key to compare against</Text>
            <TouchableOpacity style={styles.button} onPress={fetchAnswerKeys}>
              <Text style={styles.buttonText}>Select Answer Key</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>Select Answer Key:</Text>
            {answerKeys.map((key) => (
              <TouchableOpacity
                key={key.id}
                style={styles.card}
                onPress={() => { setSelectedKey(key); setStep(3); }}
              >
                <Ionicons name="document-text-outline" size={30} color="#3B82F6" />
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{key.subject}</Text>
                  <Text style={styles.cardSubtitle}>{key.numQuestions} questions</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Selected: {selectedKey?.subject}</Text>
            <Text style={styles.stepSubtitle}>Now capture the OMR sheet</Text>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>  Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={pickImage}>
              <Ionicons name="image-outline" size={24} color="#3B82F6" />
              <Text style={styles.buttonTextSecondary}>  Pick from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 4 && image && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Preview:</Text>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity
              style={[styles.button, scanning && styles.buttonDisabled]}
              onPress={scanOMR}
              disabled={scanning}
            >
              <Text style={styles.buttonText}>
                {scanning ? 'Scanning...' : 'Scan Now'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => setStep(3)}>
              <Text style={styles.buttonTextSecondary}>Retake</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 5 && result && (
          <View>
            <View style={[
              styles.scoreCard,
              result.percentage >= 70 ? styles.scorePass : styles.scoreFail
            ]}>
              <Text style={styles.scoreTitle}>Score</Text>
              <Text style={styles.scoreValue}>{result.score}/{result.total}</Text>
              <Text style={styles.scorePercentage}>{result.percentage}%</Text>
              <Text style={styles.scoreStatus}>
                {result.percentage >= 70 ? '✅ Pass' : '❌ Fail'}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Question by Question:</Text>
            {result.comparison.map((item: any) => (
              <View key={item.question} style={[
                styles.resultRow,
                item.isCorrect ? styles.correct : styles.incorrect
              ]}>
                <Text style={styles.resultQuestion}>Q{item.question}</Text>
                <Text style={styles.resultText}>Detected: {item.detected}</Text>
                <Text style={styles.resultText}>Correct: {item.correct}</Text>
                <Ionicons
                  name={item.isCorrect ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={item.isCorrect ? '#10B981' : '#EF4444'}
                />
              </View>
            ))}

            <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => {
              setStep(1);
              setImage(null);
              setImageBase64(null);
              setResult(null);
              setSelectedKey(null);
            }}>
              <Text style={styles.buttonText}>Scan Another Sheet</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  stepContainer: {
    alignItems: 'center',
    marginTop: 30,
    gap: 15,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardText: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
  },
  button: {
    width: '100%',
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  scoreCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  scorePass: {
    backgroundColor: '#3B82F6',
  },
  scoreFail: {
    backgroundColor: '#EF4444',
  },
  scoreTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  scorePercentage: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  scoreStatus: {
    fontSize: 20,
    color: '#fff',
    marginTop: 5,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  correct: {
    backgroundColor: '#D1FAE5',
  },
  incorrect: {
    backgroundColor: '#FEE2E2',
  },
  resultQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 40,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
});
