import { StyleSheet } from '@react-pdf/renderer'

const BRAND = '#1565C0'
const GRAY = '#6B7280'
const LIGHT = '#F3F4F6'
const BORDER = '#E5E7EB'

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 48
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },

  logoIcon: {
    width: 60,
    height: 'auto',
    marginBottom: 8
  },
  logoText: {
    width: 200,
    height: 'auto',
    marginBottom: 8
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: BRAND
  },
  companyTagline: {
    fontSize: 8,
    color: GRAY,
    marginTop: 2
  },
  reportLabel: {
    fontSize: 8,
    color: GRAY,
    textAlign: 'right'
  },
  reportId: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: BRAND,
    textAlign: 'right',
    marginTop: 2
  },
  divider: {
    borderBottomWidth: 1.5,
    borderBottomColor: BRAND,
    marginBottom: 20
  },
  summaryBand: {
    backgroundColor: BRAND,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  summaryItem: {
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 3
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF'
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: BRAND,
    marginBottom: 8
  },
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER
  },
  tableRowAlt: {
    backgroundColor: LIGHT
  },
  tableRowLast: {
    borderBottomWidth: 0
  },
  tableCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6
  },
  tableCellLabel: {
    fontSize: 7,
    color: GRAY,
    marginBottom: 2
  },
  tableCellValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#111827'
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  badge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#15803D'
  },
  notesBox: {
    backgroundColor: LIGHT,
    borderRadius: 4,
    padding: 12,
    marginBottom: 24
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: GRAY,
    marginBottom: 4
  },
  notesText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerText: {
    fontSize: 7.5,
    color: GRAY
  },
  imageRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  imageBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center'
  },
  imageLabel: {
    fontSize: 8,
    color: '#64748b',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    letterSpacing: 0.5
  },
  vehicleImage: {
    width: '100%',
    height: 140,
    objectFit: 'contain',
    borderRadius: 4
  },
  noImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  noImageText: {
    fontSize: 9,
    color: '#94a3b8',
    fontFamily: 'Helvetica'
  }
})
