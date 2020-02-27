import React, { Component } from 'react'
import {Table} from 'reactstrap'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Axios from 'axios'
import { APIURL } from '../support/ApiURL'

class History extends Component {

    getCurrentDate(separator=''){

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
        }

    render() {
        if(this.props.Auth.id===''){
            return <Redirect to='/' />
        }
        if(this.props.Auth.role!=='user'){
            return <Redirect to='/notfound'/>
        }
        if(this.props.userId){
            return (
                <div>
                <center className='center'>
                    <Table className='mt-3' style={{width:600,color:'white'}}>
                        <thead>
                            <tr>
                                <th style={{width:100,color:'white'}}>Date</th>
                                <th style={{width:300,color:'white'}}>Title</th>
                                <th style={{width:100,color:'white'}}>Schedule</th>
                                <th style={{width:100,color:'white'}}>Seat</th>
                                <th style={{width:100,color:'white'}}>Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.getCurrentDate}
                        </tbody>
                    </Table>
                </center>
            </div>
        )
    }
    }
}

const MapStateToProps=(state)=>{
    return{
        AuthLog:state.Auth.login,
        userId:state.Auth.id,
        totalharga: state.Auth.totalharga,
        Auth:state.Auth
    }
}

export default connect(MapStateToProps)(History)

