import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Linking
} from 'react-native';

class WebLinks extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const styles = StyleSheet.create({
            webLink: {
                color: '#666666',
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            },
            webLinks: {
                flexDirection: 'row',
                alignItems: 'center',
            }
        });

        return (
            <View style={styles.webLinks}>
                <TouchableOpacity
                    onPress={() => {
                        Linking.openURL('https://beta.auramaze.org/privacy');
                    }}
                    underlayColor='#fff'>
                    <Text style={styles.webLink}>
                        Privacy Policy
                    </Text>
                </TouchableOpacity>
                <Text>|</Text>
                <TouchableOpacity
                    onPress={() => {
                        Linking.openURL('https://beta.auramaze.org/#contact');
                    }}
                    underlayColor='#fff'>
                    <Text style={styles.webLink}>
                        Contact Us
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default WebLinks;
