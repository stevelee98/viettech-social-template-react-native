import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import commonStyles from 'styles/commonStyles';
import styles from './styles';

const LoginView = () => {
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);

    return (
        <View style={styles.container}>
            <View style={{ flexGrow: 1 }}>
                <View style={styles.circle} />
                <View style={styles.top}>
                    <Text style={styles.welcome}>Let's Start with</Text>
                    <Text style={styles.loginTxt}>Login</Text>
                </View>
                <View style={styles.inputForm}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={txt => setUserName(txt)}
                            value={userName}
                            placeholder="Enter username"
                            returnKeyType="next"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={txt => setPassword(txt)}
                            value={password}
                            placeholder="Enter password"
                            returnKeyType="done"
                        />
                        <Pressable style={styles.btn}>
                            <Text
                                style={{
                                    ...commonStyles.textBold,
                                    color: 'white',
                                }}
                            >
                                Login
                            </Text>
                        </Pressable>
                    </View>
                    <Text style={styles.forgetPass}>Forget password?</Text>
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.txtBottom}>
                        Don't have account?{' '}
                        <Text style={styles.signUp}>Register</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default LoginView;
