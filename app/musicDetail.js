import React, {Component} from 'react'
import {View, ScrollView, Image, Text} from 'react-native'
import StarRating from 'react-native-star-rating';
import  LoadingView  from './loadingView.js'

const MUSIC_URL='https://api.douban.com/v2/music/';

var music_id = null;

export default class MusicDetail extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: navigation.state.params.title
    });

    constructor(props) {
        super(props);
        music_id = this.props.navigation.state.params.id;
        this.state = {
            dataSource:null,
            loading: false,
        }
    }

    componentWillMount() {
        this.getMusicDetailInfo()
    }

    render(){
        if (this.state.loading) {
            return (
                <LoadingView/>
            )
        }
        return(
            <ScrollView>
                <View style={{flex:1, backgroundColor:'white'}}>
                    <View style={{flex:1, backgroundColor: 'orange'}}>
                        <Image
                            style={{width: 150, height: 230, margin:20, alignSelf:'center'}}
                            source={{uri: this.state.dataSource.image}}/>
                    </View>
                    <View style={{flex: 1, margin:20}}>
                        <View style={{flex: 1, flexDirection:'row', justifyContent:'space-between'}}>
                            <View>
                                <Text style={{fontSize:20, fontWeight:'bold', color:'black'}}>{this.state.dataSource.title}</Text>
                                <Text>歌手：{this.state.dataSource.author[0].name}</Text>
                                <Text>发行公司：{this.state.dataSource.attrs.publisher}</Text>
                                <Text>发行时间：{this.state.dataSource.attrs.pubdate}</Text>
                            </View>
                            <View style={{backgroundColor: 'white',alignSelf:'center', padding:10, elevation: 5, alignItems:'center', justifyContent:'center'}}>
                                <Text>豆瓣评分</Text>
                                <Text style={{fontSize:18, fontWeight:'bold', color:'black'}}>{this.state.dataSource.rating.average}</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    emptyStar={'ios-star-outline'}
                                    fullStar={'ios-star'}
                                    halfStar={'ios-star-half'}
                                    iconSet={'Ionicons'}
                                    rating={this.state.dataSource.rating.average/2}
                                    starColor={'#FABD3B'}
                                    emptyStarColor={'#FABD3B'}
                                    starSize={14}
                                />
                                <Text>{this.state.dataSource.rating.numRaters}人</Text>
                            </View>
                        </View>
                        {/*<View style={{height:0.5, backgroundColor:'gray', marginTop:20, marginBottom:20}}/>*/}
                        {/*<Text>简介</Text>*/}
                        {/*<Text style={{lineHeight: 30}}>{this.state.dataSource.summary}</Text>*/}
                        {/*<View style={{height:0.5, backgroundColor:'gray', marginTop:20, marginBottom:20}}/>*/}
                        {/*<Text>作者</Text>*/}
                        {/*<Text style={{lineHeight: 30}}>{this.state.dataSource.author_intro}</Text>*/}
                        <View style={{height:0.5, backgroundColor:'gray', marginTop:20, marginBottom:20}}/>
                        {this.checkCatalog(this.state.dataSource.attrs.tracks)}
                    </View>
                </View>
            </ScrollView>
        )
    }

    checkCatalog(catalog) {
        if (!catalog) {
            return null;
        }
        return(
            <Text style={{lineHeight: 35}}>{'目录\n'+catalog}</Text>
        )
    }

    getMusicDetailInfo(){
        this.setState({
            dataSource:null,
            loading:true
        });
        fetch(MUSIC_URL + music_id)
            .then((response) => response.json())
            .then((responseJson)=>{
                this.setState({
                    dataSource: responseJson,
                    loading: false,
                })
            })
            .catch((error=>{
                this.setState({
                    dataSource: error,
                    loading: false,
                })
            }))
    }

}