import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard, AsyncStorage
} from 'react-native';
import UserIndex from "./user-index";
import BlankUser from "./blank-user";

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {pageIsSign: true, hasAuthorized: false};
    }

    componentDidMount() {

        AsyncStorage.getItem('isAuthorized', null).then((value) => {
            if (value === undefined || value === 'false') {
                AsyncStorage.multiSet([
                    ['isAuthorized', 'false'],
                    ["username", 'undefined'],
                    ["token", 'undefined'],
                    ["id", 'undefined'],
                ]);
                this.setState({hasAuthorized: false});
            } else {
                this.setState({hasAuthorized: true});
            }
        });
    };

    render() {

        let _toLogOut = () => {
            AsyncStorage.multiSet([
                ['isAuthorized', 'false'],
                ["username", 'undefined'],
                ["token", 'undefined'],
                ["id", 'undefined'],
            ]).then(this.setState({hasAuthorized: false}));
        };

        let _toLogIn = () => {
            this.setState({hasAuthorized: true});
        };

        if (this.state.hasAuthorized !== true) {
            return (
                <BlankUser screenProps={{toLogIn: _toLogIn}}/>
            );
        } else {
            return (
                <UserIndex screenProps={{toLogOut: _toLogOut}}/>
            )
        }

    }
}

export default User;
