import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

type AnswerKey = {
  id: string;
  subject: string;
  numQuestions: number;
  answers: string[];
  createdAt: any;
};

export default function ViewAnswerKeys() {
  const [answerKeys, setAnswerKeys] = useState<AnswerKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnswerKeys();
  }, []);

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
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Answer Key',
      'Are you sure you want to delete this answer key?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'answerKeys', id));
              setAnswerKeys(answerKeys.filter(key => key.id !== id));
              Alert.alert('Success', 'Answer key deleted!');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Previous Answer Keys</Text>
      </View>

      <View style={styles.body}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : answerKeys.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No answer keys found</Text>
            <Text style={styles.emptySubtext}>Create your first answer key!</Text>
          </View>
        ) : (
          answerKeys.map((key) => (
            <TouchableOpacity
              key={key.id}
              style={styles.card}
              onPress={() => router.push({ pathname: '/edit-answer-key', params: { id: key.id } })}
            >
              <View style={styles.cardLeft}>
                <Ionicons name="document-text-outline" size={40} color="#3B82F6" />
              </View>
              <View style={styles.cardMiddle}>
                <Text style={styles.cardTitle}>{key.subject}</Text>
                <Text style={styles.cardSubtitle}>{key.numQuestions} questions</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(key.id)}
              >
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
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
  loadingText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
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
  cardLeft: {
    marginRight: 15,
  },
  cardMiddle: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 3,
  },
  deleteButton: {
    padding: 5,
  },
});