import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'right',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
    padding: 5,
    textAlign: 'right',
  },
});

// PDF Document Component
const ReportPDF = ({ data, title }: { data: any[]; title: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.table}>
          {/* Table Headers */}
          <View style={styles.tableRow}>
            {Object.keys(data[0]).map((key) => (
              <View style={styles.tableCol} key={key}>
                <Text style={styles.tableCell}>{key}</Text>
              </View>
            ))}
          </View>
          {/* Table Data */}
          {data.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              {Object.values(item).map((value, i) => (
                <View style={styles.tableCol} key={i}>
                  <Text style={styles.tableCell}>{value as string}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

interface ExportDataProps {
  data: any[];
  filename: string;
  title: string;
}

export const ExportData = ({ data, filename, title }: ExportDataProps) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <div className="flex gap-4">
      <Button onClick={exportToExcel} variant="outline">
        <FileDown className="ml-2 h-4 w-4" />
        تصدير إلى Excel
      </Button>

      <PDFDownloadLink
        document={<ReportPDF data={data} title={title} />}
        fileName={`${filename}.pdf`}
      >
        {({ loading }) => (
          <Button variant="outline" disabled={loading}>
            <FileDown className="ml-2 h-4 w-4" />
            {loading ? 'جاري التحميل...' : 'تصدير إلى PDF'}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
};
