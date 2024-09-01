import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import './RegistrationHistory.css';

// Đăng ký font tùy chỉnh
Font.register({
    family: 'Helvetica',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/fonts/helvetica.ttf'
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 30,
        backgroundColor: '#fff'
    },
    section: {

        textAlign:"center"
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: 1,
        marginTop:10,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row'
    },
    tableCol: {
        width: '20%',
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: 1,
        padding: 5
    },
    tableCell: {
        margin: 'auto',
        textAlign: 'center',
        fontFamily: 'Helvetica'
    },
    qrCode: {
        marginTop: 20,
        marginLeft:350,
    },
    
});

const GeneratePDF = ({ registration }) => {
    const [qrCodeUrl, setQrCodeUrl] = React.useState('');
    console.log("rererere",registration);
    React.useEffect(() => {
        QRCode.toDataURL(JSON.stringify(registration))
            .then(url => setQrCodeUrl(url))
            .catch(err => console.error(err));
    }, [registration]);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Thong Tin Dang ky</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Tên Xe</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Tên Bai Xe</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Dia Chi</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Khu Do Xe</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{registration.tenXe}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{registration.tenBai}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{registration.diaChi}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{registration.tenKhu}</Text></View>
                        </View>
                    </View>
                    <View style={styles.qrCode}>
                        {qrCodeUrl && <Image src={qrCodeUrl} style={{ width: 128, height: 128 }} />}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const PDFLink = ({ registration }) => (
    <PDFDownloadLink
    document={<GeneratePDF registration={registration} />}
    fileName={`BaiXe_${registration.tenBai}_${registration.tenKhu + registration.vitri}.pdf`}
    className="pdf-download-link" // Applying the CSS class
>
    {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
</PDFDownloadLink>
);

export default PDFLink;
