import React from 'react'

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
})

interface DocProps {
  id: string
}

// Create Document Component
const MyDocument = ({ id }: DocProps) => (
  <Document title='Test PDF Report'>
    <Page size='A4' style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1 for ID: {id}</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
)

export default MyDocument
