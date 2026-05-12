'use client'

import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'

import { styles } from './styles/vehicleReport'

export type IntrusionSummaryRecord = {
  id: number
  intrusion_type: string
  description: string | null
  intrusion_dt: Date | null
  created_at: Date | null
}

const formatDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`

const formatTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

const IntrusionSummaryReport = ({
  records,
  fromDate,
  toDate
}: {
  records: IntrusionSummaryRecord[]
  fromDate: string
  toDate: string
}) => {
  const generatedAt = new Date()

  const formatInputDate = (dateStr: string) => {
    try {
      return formatDate(new Date(dateStr))
    } catch {
      return dateStr
    }
  }

  const totalEvents = records.length

  return (
    <Document title={`Intrusion Summary Report (${fromDate} to ${toDate})`} producer='sigma' author='WBSWC'>
      <Page size='A4' orientation='portrait' style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoIcon} src={'/images/logo1.png'} />
            <Image style={styles.logoText} src={'/images/logo2.png'} />
          </View>
          <View>
            <Text style={styles.reportLabel}>INTRUSION SUMMARY REPORT</Text>
            <Text style={{ ...styles.reportId, fontSize: 14 }}>
              {formatInputDate(fromDate)} to {formatInputDate(toDate)}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, marginTop: 4 }}>
          <Text style={{ fontSize: 9, color: '#555' }}>
            <Text style={{ fontWeight: 'bold' }}>Note: </Text>
            This report contains all security intrusion alerts captured by the AI system within the specified period.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryBand}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL EVENTS</Text>
            <Text style={styles.summaryValue}>{totalEvents}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>PERIOD</Text>
            <Text style={styles.summaryValue}>
              {formatInputDate(fromDate)} - {formatInputDate(toDate)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>INTRUSION LOG DETAILS</Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <View style={{ ...styles.tableCell, flex: 0.4 }}>
              <Text style={styles.tableCellValue}>ID</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1 }}>
              <Text style={styles.tableCellValue}>Date</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 0.8 }}>
              <Text style={styles.tableCellValue}>Time</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1.5 }}>
              <Text style={styles.tableCellValue}>Intrusion Type</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 2.3 }}>
              <Text style={styles.tableCellValue}>Description</Text>
            </View>
          </View>

          {/* Data Rows */}
          {records.length > 0 ? (
            records.map((record, index) => (
              <View key={record.id} style={[styles.tableRow, index === records.length - 1 ? styles.tableRowLast : {}]}>
                <View style={{ ...styles.tableCell, flex: 0.4 }}>
                  <Text style={styles.tableCellLabel}>#{record.id}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1 }}>
                  <Text style={styles.tableCellLabel}>
                    {record.created_at ? formatDate(new Date(record.created_at)) : '--'}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 0.8 }}>
                  <Text style={styles.tableCellLabel}>
                    {record.created_at ? formatTime(new Date(record.created_at)) : '--'}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1.5 }}>
                  <Text style={styles.tableCellLabel}>{record.intrusion_type ?? '--'}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 2.3 }}>
                  <Text style={styles.tableCellLabel}>{record.description ?? 'No detail provided'}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.tableRow, styles.tableRowLast]}>
              <View style={{ ...styles.tableCell, flex: 1 }}>
                <Text style={{ ...styles.tableCellLabel, textAlign: 'center' }}>
                  No intrusion records found for the selected date range.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>WB State Warehousing Corporation - Security Division</Text>
          <Text style={styles.footerText}>
            Generated: {formatDate(generatedAt)} {formatTime(generatedAt)}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default IntrusionSummaryReport
