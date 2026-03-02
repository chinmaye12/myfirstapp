import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={40} color="#fff" />
        <Text style={styles.headerTitle}>OMR Scanner</Text>
        <Text style={styles.headerSubtitle}>Welcome, Teacher! 👋</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>What would you like to do?</Text>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="create-outline" size={40} color="#3B82F6" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Create Answer Key</Text>
            <Text style={styles.cardSubtitle}>Set up a new answer key for your exam</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="folder-outline" size={40} color="#8B5CF6" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Previous Answer Keys</Text>
            <Text style={styles.cardSubtitle}>View or edit your saved answer keys</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="scan-outline" size={40} color="#10B981" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Scan OMR Sheet</Text>
            <Text style={styles.cardSubtitle}>Scan and grade a student's answer sheet</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    padding: 40,
    alignItems: 'center',
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    marginTop: 5,
  },
  body: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 20,
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
    marginTop: 3,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});