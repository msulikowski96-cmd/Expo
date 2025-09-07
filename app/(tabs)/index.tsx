
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, TextInput, Chip } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FEATURES = [
  'CV Analysis & Scoring',
  'Skills Gap Analysis',
  'ATS Optimization',
  'Cover Letter Generation',
  'Interview Questions',
  'Career Recommendations'
];

export default function HomeScreen() {
  const [jobDescription, setJobDescription] = useState('');
  const [analysisType, setAnalysisType] = useState('cv_analysis');

  const saveJobDescription = async () => {
    try {
      await AsyncStorage.setItem('jobDescription', jobDescription);
      Alert.alert('Success', 'Job description saved for analysis');
    } catch (error) {
      Alert.alert('Error', 'Failed to save job description');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>CvToai</ThemedText>
        <ThemedText style={styles.subtitle}>
          AI-Powered CV Analysis & Career Enhancement
        </ThemedText>
      </ThemedView>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Welcome to CvToai</Title>
          <Paragraph>
            Transform your career with AI-powered CV analysis, personalized recommendations, 
            and professional development tools.
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Key Features</Title>
          <View style={styles.featuresContainer}>
            {FEATURES.map((feature, index) => (
              <Chip key={index} style={styles.chip} mode="outlined">
                {feature}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Job Description (Optional)</Title>
          <Paragraph style={styles.description}>
            Paste a job description to get targeted analysis and recommendations.
          </Paragraph>
          <TextInput
            mode="outlined"
            placeholder="Enter job description here..."
            value={jobDescription}
            onChangeText={setJobDescription}
            multiline
            numberOfLines={6}
            style={styles.textInput}
          />
          <Button 
            mode="contained" 
            onPress={saveJobDescription}
            style={styles.button}
            disabled={!jobDescription.trim()}
          >
            Save for Analysis
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Get Started</Title>
          <Paragraph>
            Upload your CV in the Upload tab to begin your AI-powered career analysis.
          </Paragraph>
          <Button 
            mode="contained" 
            style={[styles.button, styles.primaryButton]}
            onPress={() => {/* Navigate to upload tab */}}
          >
            Upload CV Now
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    marginBottom: 5,
  },
  description: {
    marginBottom: 10,
    color: '#6c757d',
  },
  textInput: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
});
