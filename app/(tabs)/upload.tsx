
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, ProgressBar, Chip } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const ANALYSIS_TYPES = [
  { key: 'cv_analysis', label: 'CV Analysis & Scoring' },
  { key: 'skills_gap', label: 'Skills Gap Analysis' },
  { key: 'ats_optimization', label: 'ATS Optimization' },
  { key: 'cover_letter', label: 'Cover Letter Generation' },
  { key: 'interview_prep', label: 'Interview Questions' },
];

export default function UploadScreen() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisType, setAnalysisType] = useState('cv_analysis');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
        Alert.alert('Success', 'File selected successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadAndAnalyze = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 0.9) {
            clearInterval(progressInterval);
            return 0.9;
          }
          return prev + 0.1;
        });
      }, 200);

      // Read file content
      const fileContent = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save analysis data
      const analysisData = {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        analysisType,
        uploadDate: new Date().toISOString(),
        fileContent: fileContent.substring(0, 1000), // Truncate for demo
      };

      await AsyncStorage.setItem('lastAnalysis', JSON.stringify(analysisData));
      
      setUploadProgress(1);
      setTimeout(() => {
        setIsUploading(false);
        Alert.alert('Success', 'CV uploaded and analysis started!', [
          { text: 'View Results', onPress: () => {/* Navigate to results */} },
          { text: 'OK' }
        ]);
      }, 500);

    } catch (error) {
      setIsUploading(false);
      Alert.alert('Error', 'Failed to upload and analyze CV');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Upload CV</ThemedText>
        <ThemedText style={styles.subtitle}>
          Upload your CV for AI-powered analysis
        </ThemedText>
      </ThemedView>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Supported Formats</Title>
          <Paragraph>PDF, DOC, DOCX files are supported</Paragraph>
          <View style={styles.formatChips}>
            <Chip mode="outlined">PDF</Chip>
            <Chip mode="outlined">DOC</Chip>
            <Chip mode="outlined">DOCX</Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Select File</Title>
          {selectedFile ? (
            <View style={styles.fileInfo}>
              <Paragraph>Selected: {selectedFile.name}</Paragraph>
              <Paragraph>Size: {(selectedFile.size / 1024).toFixed(2)} KB</Paragraph>
            </View>
          ) : (
            <Paragraph>No file selected</Paragraph>
          )}
          <Button 
            mode="outlined" 
            onPress={pickDocument}
            style={styles.button}
            disabled={isUploading}
          >
            {selectedFile ? 'Change File' : 'Select CV File'}
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Analysis Type</Title>
          <View style={styles.analysisTypes}>
            {ANALYSIS_TYPES.map((type) => (
              <Chip
                key={type.key}
                mode={analysisType === type.key ? 'flat' : 'outlined'}
                selected={analysisType === type.key}
                onPress={() => setAnalysisType(type.key)}
                style={styles.analysisChip}
              >
                {type.label}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      {isUploading && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Uploading & Analyzing...</Title>
            <ProgressBar progress={uploadProgress} style={styles.progressBar} />
            <Paragraph>{Math.round(uploadProgress * 100)}% complete</Paragraph>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Start Analysis</Title>
          <Paragraph>
            Upload your CV and get instant AI-powered insights and recommendations.
          </Paragraph>
          <Button 
            mode="contained" 
            onPress={uploadAndAnalyze}
            style={[styles.button, styles.primaryButton]}
            disabled={!selectedFile || isUploading}
            loading={isUploading}
          >
            {isUploading ? 'Analyzing...' : 'Upload & Analyze'}
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
    fontSize: 28,
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
  formatChips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  fileInfo: {
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  button: {
    marginTop: 15,
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
  analysisTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  analysisChip: {
    marginBottom: 5,
  },
  progressBar: {
    marginVertical: 10,
  },
});
