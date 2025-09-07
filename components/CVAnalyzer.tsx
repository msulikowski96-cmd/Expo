
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CVAnalyzerProps {
  onAnalysisComplete?: (results: any) => void;
}

export default function CVAnalyzer({ onAnalysisComplete }: CVAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCV = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate API call to analyze CV
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = {
        score: Math.floor(Math.random() * 30) + 70,
        suggestions: [
          'Add more technical keywords',
          'Quantify your achievements',
          'Update your skills section',
          'Improve formatting consistency'
        ],
        matchedSkills: Math.floor(Math.random() * 5) + 3,
        totalSkills: 8,
      };

      await AsyncStorage.setItem('analysisResults', JSON.stringify(mockResults));
      
      if (onAnalysisComplete) {
        onAnalysisComplete(mockResults);
      }
      
      Alert.alert('Analysis Complete', 'Your CV has been analyzed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze CV. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>CV Analysis</Title>
        <Paragraph>
          Paste a job description to get targeted CV recommendations:
        </Paragraph>
        
        <TextInput
          mode="outlined"
          placeholder="Paste job description here (optional)..."
          value={jobDescription}
          onChangeText={setJobDescription}
          multiline
          numberOfLines={4}
          style={styles.textInput}
        />
        
        <Button
          mode="contained"
          onPress={analyzeCV}
          loading={isAnalyzing}
          disabled={isAnalyzing}
          style={styles.button}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze CV'}
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  textInput: {
    marginVertical: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
  },
});
