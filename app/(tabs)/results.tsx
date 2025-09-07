
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Title, Paragraph, Chip, ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const MOCK_ANALYSIS_RESULTS = {
  overall_score: 85,
  sections: {
    contact_info: { score: 95, feedback: "Complete and professional contact information" },
    summary: { score: 80, feedback: "Good summary, could be more impactful" },
    experience: { score: 90, feedback: "Strong work experience with clear achievements" },
    education: { score: 85, feedback: "Relevant education background" },
    skills: { score: 75, feedback: "Good technical skills, consider adding soft skills" }
  },
  recommendations: [
    "Add more quantifiable achievements",
    "Include relevant keywords for ATS optimization",
    "Consider adding a professional summary",
    "Update skills section with latest technologies"
  ],
  missing_skills: [
    "Cloud Computing (AWS/Azure)",
    "Agile Methodologies",
    "Project Management",
    "Data Analysis"
  ]
};

export default function ResultsScreen() {
  const [analysisData, setAnalysisData] = useState(null);
  const [results, setResults] = useState(MOCK_ANALYSIS_RESULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    try {
      const data = await AsyncStorage.getItem('lastAnalysis');
      if (data) {
        setAnalysisData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText>Loading analysis results...</ThemedText>
      </View>
    );
  }

  if (!analysisData) {
    return (
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Results</ThemedText>
          <ThemedText style={styles.subtitle}>No analysis available</ThemedText>
        </ThemedView>
        <Card style={styles.card}>
          <Card.Content>
            <Title>No CV Analysis Found</Title>
            <Paragraph>Please upload a CV first to see analysis results.</Paragraph>
            <Button mode="contained" style={styles.button}>
              Upload CV
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Analysis Results</ThemedText>
        <ThemedText style={styles.subtitle}>
          {analysisData.fileName}
        </ThemedText>
      </ThemedView>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Overall Score</Title>
          <View style={styles.scoreContainer}>
            <ThemedText style={[styles.scoreText, { color: getScoreColor(results.overall_score) }]}>
              {results.overall_score}/100
            </ThemedText>
            <ProgressBar 
              progress={results.overall_score / 100} 
              style={styles.progressBar}
              color={getScoreColor(results.overall_score)}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Section Breakdown</Title>
          {Object.entries(results.sections).map(([section, data]) => (
            <View key={section} style={styles.sectionItem}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionName}>
                  {section.replace('_', ' ').toUpperCase()}
                </ThemedText>
                <ThemedText style={[styles.sectionScore, { color: getScoreColor(data.score) }]}>
                  {data.score}/100
                </ThemedText>
              </View>
              <Paragraph style={styles.feedback}>{data.feedback}</Paragraph>
              <ProgressBar 
                progress={data.score / 100} 
                style={styles.sectionProgressBar}
                color={getScoreColor(data.score)}
              />
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recommendations</Title>
          {results.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <ThemedText>• {recommendation}</ThemedText>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Missing Skills</Title>
          <Paragraph style={styles.description}>
            Consider adding these skills to improve your CV:
          </Paragraph>
          <View style={styles.skillsContainer}>
            {results.missing_skills.map((skill, index) => (
              <Chip key={index} mode="outlined" style={styles.skillChip}>
                {skill}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Next Steps</Title>
          <Button mode="contained" style={styles.button}>
            Generate Cover Letter
          </Button>
          <Button mode="outlined" style={styles.button}>
            Get Interview Questions
          </Button>
          <Button mode="outlined" style={styles.button}>
            Download Report
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 8,
  },
  sectionItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sectionName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionScore: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedback: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  sectionProgressBar: {
    height: 6,
  },
  recommendationItem: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 10,
    color: '#6c757d',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  skillChip: {
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
  },
});
