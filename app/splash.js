/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  ToastAndroid,
  View
} from 'react-native';

import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import {StackNavigator} from 'react-navigation'
import MyApp from "./main.js";
import ViewPager from "./viewpager";
import BookDetail from "./bookDetail";
import MusicDetail from "./musicDetail";
import MovieDetail from "./movieDetail";

const MAIN = 'Main';

class SplashScreen extends Component {

    onStart() {
        const {navigate} = this.props.navigation;
        // navigate(MAIN)
        navigate('ViewPager')
    }

  render() {
    return (
      <View style={{flex:1}}>
                 <IndicatorViewPager
                    style={styles.container}
                    indicator={this._renderDotIndicator()}>
                    <View style={{backgroundColor:'cadetblue', alignItems:'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 20}}>page one</Text>
                    </View>
                    <View style={{backgroundColor:'cornflowerblue', alignItems:'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 20}}>page two</Text>
                    </View>
                    <View style={style=styles.pager}>
                        <Text
                            style={{fontSize: 20}}>page three</Text>
                            <View style={styles.bottom}>
                                <Button
                                    style={styles.bottom}
                                    onPress = {() => this.onStart()}
                                    title = '欢迎使用此Demo'/>
                            </View>
                    </View>
                </IndicatorViewPager>
            </View>
    );
  }

    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={3} />;
    }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  pager: {
    backgroundColor: '#1AA094',
    alignItems: 'center',
    justifyContent: 'center',
  },
    bottom:{
        position:'absolute',
        bottom:0,
        marginBottom: 50
  }
});

const SimpleApp = StackNavigator({
    Splash: {
        screen: SplashScreen,
        navigationOptions: {
            header: null
        }
    },
    Main: {
        screen: MyApp,
        navigationOptions: {
            headerLeft: null
        }
    },
    ViewPager: {
        screen: ViewPager,
        navigationOptions: {
            header: null
        }
    },
    BookDetail: {
        screen: BookDetail
    },
    MusicDetail: {
        screen: MusicDetail
    },
    MovieDetail: {
        screen: MovieDetail
    },
});

export default SimpleApp;
