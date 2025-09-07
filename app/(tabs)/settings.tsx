
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, TextInput, Switch, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ApiService } from '@/services/ApiService';

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedApiKey = await AsyncStorage.getItem('openrouter_api_key');
      const savedNotifications = await AsyncStorage.getItem('notifications_enabled');
      const savedDarkMode = await AsyncStorage.getItem('dark_mode_enabled');
      const savedAutoAnalyze = await AsyncStorage.getItem('auto_analyze_enabled');

      if (savedApiKey) setApiKey(savedApiKey);
      if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications));
      if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
      if (savedAutoAnalyze !== null) setAutoAnalyze(JSON.parse(savedAutoAnalyze));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveApiKey = async () => {
    try {
      await ApiService.setApiKey(apiKey);
      Alert.alert('Success', 'API key saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  const saveSetting = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save setting:', error);
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all saved analysis results, settings, and cached data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setApiKey('');
              setNotifications(true);
              setDarkMode(false);
              setAutoAnalyze(false);
              Alert.alert('Success', 'All data cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Settings</ThemedText>
        <ThemedText style={styles.subtitle}>
          Configure your CvToai experience
        </ThemedText>
      </ThemedView>

      <Card style={styles.card}>
        <Card.Content>
          <Title>API Configuration</Title>
          <Paragraph style={styles.description}>
            Enter your OpenRouter API key to enable AI-powered analysis features.
          </Paragraph>
          <TextInput
            mode="outlined"
            label="OpenRouter API Key"
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            placeholder="sk-or-..."
            style={styles.textInput}
          />
          <Button 
            mode="contained" 
            onPress={saveApiKey}
            style={styles.button}
            disabled={!apiKey.trim()}
          >
            Save API Key
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>App Preferences</Title>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingTitle}>Push Notifications</ThemedText>
              <Paragraph>Receive notifications about analysis completion</Paragraph>
            </View>
            <Switch
              value={notifications}
              onValueChange={(value) => {
                setNotifications(value);
                saveSetting('notifications_enabled', value);
              }}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingTitle}>Dark Mode</ThemedText>
              <Paragraph>Use dark theme throughout the app</Paragraph>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(value) => {
                setDarkMode(value);
                saveSetting('dark_mode_enabled', value);
              }}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingTitle}>Auto-Analyze</ThemedText>
              <Paragraph>Automatically start analysis after file upload</Paragraph>
            </View>
            <Switch
              value={autoAnalyze}
              onValueChange={(value) => {
                setAutoAnalyze(value);
                saveSetting('auto_analyze_enabled', value);
              }}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>About</Title>
          <Paragraph>
            CvToai - AI-Powered CV Analysis & Career Enhancement
          </Paragraph>
          <Paragraph style={styles.version}>Version 1.0.0</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Data Management</Title>
          <Paragraph style={styles.description}>
            Clear all saved data including analysis results and settings.
          </Paragraph>
          <Button 
            mode="outlined" 
            onPress={clearAllData}
            style={[styles.button, styles.dangerButton]}
            textColor="#dc3545"
          >
            Clear All Data
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
  description: {
    marginBottom: 15,
    color: '#6c757d',
  },
  textInput: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  dangerButton: {
    borderColor: '#dc3545',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  divider: {
    marginVertical: 10,
  },
  version: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5,
  },
});
