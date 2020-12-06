/*
 * Copyright (c) 2019 General Electric Company. All rights reserved.
 *
 * The copyright to the computer software herein is the property of
 * General Electric Company. The software may be used and/or copied only
 * with the written permission of General Electric Company or in accordance
 * with the terms and conditions stipulated in the agreement/contract
 * under which the software has been supplied.
 *
 * author: apolo.yasuda@ge.com
 */

'use strict';

const TOKEN_URI = "/oauth/token";

class OALogin extends React.Component {
    constructor(props) {
    	super(props);
    	this.state = {
    	    elements:{
          		usr_id:{
          		    value:"",
          		    classNames:"form-control"
          		},
          		usr_pwd:{
          		    value:"",
          		    classNames:"form-control"
          		},
          		message:{
          		    classNames:"d-none",
          		    value:""
          		},
          		btn_signin: {
          		    classNames:"btn btn-lg btn-primary btn-block",
          		    value:"Sign-in"
          		},
          		btn_continue: {
          		    classNames:"d-none",
          		    value:"Continue"
          		}

    	    }
    	}

    	//this.inputResponseType = {value:""};
    	//vaCr searchParams1 = new URLSearchParams(paramsString1);
    	//alert(location.search)
    	const params = new URLSearchParams(location.search)

    	this.inputScope = {value:params.get("scope")};
    	console.log(this.inputScope.value);
    	this.inputRedirectURL = {value:params.get("redirect_uri")};
    	console.log(this.inputRedirectURL.value);
    	this.inputResponseType = {value:params.get("response_type")};
    	console.log(this.inputResponseType.value);
    	this.inputLoginHint = {value:params.get("login_hint")};
    	console.log(this.inputLoginHint.value);
    	this.inputClientId = {value:params.get("client_id")};
    	console.log(this.inputClientId.value);
    	if (this.inputLoginHint.value!=null) {
    	    this.inputLoginHint.value = JSON.parse(this.inputLoginHint.value);
    	}

    	var op = params.get("err_code");
    	if (op=="csc_invalid") {
    	    this.state.elements.message.value = "the user credential is invalid.";
    	    this.state.elements.message.classNames = "alert alert-danger";
    	}

    	console.log(op);

    	this.handleChange = this.handleChange.bind(this);
    	this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleChange(event) {
	      const type = event.target.type,
	      name = event.target.name,
	      value = event.target.value;
      	var op=this.state.elements;
      	op[name].value=value;
      	console.log(op);
      	this.setState(op);
    }

    //handleOnClick(event){

    //}

    handleOnClick(event) {
    	try{
    	    var params = {
    		      grant_type: 'client_credentials'
    	    };

    	    var op = "";
    	    for (var k in params) {
        		if (op!="") op=op+"&";
        		op = `${k}=${params[k]}`
    	    }

    	    var headers = {
        		"Authorization":"Basic "+btoa(`${this.state.elements.usr_id.value}:${this.state.elements.usr_pwd.value}`),
        		"Content-Type":"application/x-www-form-urlencoded"
    	    }

    	    var request = {
        		method: 'POST',
        		headers: headers,
        		body: op
    	    };

    	    //console.log(`request: ${JSON.stringify(request)}`);

    	    fetch(TOKEN_URI, request).then(res => res.json())
    		    .then(response =>{
    		    if (response.access_token==null)
    			     throw response;

    		    var op=this.state.elements;
    		    op.message.classNames="alert alert-warning";
    		    op.message.value=`the app (${this.inputLoginHint.value.origin}) is requesting the permission for the following scope: \n \"${this.inputScope.value}\" \n please click continue to grant the permission.`;
    		    op.usr_id.classNames="d-none";
    		    op.usr_pwd.classNames="d-none";
    		    op.btn_signin.classNames="d-none";
    		    op.btn_continue.classNames="btn btn-lg btn-primary btn-block";
    		    this.setState(op);
    		    //console.log(`token: ${JSON.stringify(response)}`);
    		})
    		  .catch(error=>{
    		    //console.error('exception:', error);
    		    var op=this.state.elements;
    		    op.message.classNames="alert alert-danger";
    		    if (error.reason==null)
    			     op.message.value=JSON.stringify(error);
    		    else
    			     op.message.value=error.reason;

    		    this.setState(op);
    		});
    	} catch(e) {
    	    console.log(`err:${e}`);
    	}
    	event.preventDefault();
    }

    render() {
      	return (
      		<form className="form-signin" method="POST" >
      				<h1 className="h3 mb-3 font-weight-normal">EC OAuth Sign In</h1>
      		    <div className={this.state.elements.message.classNames} role="alert">
      		        { this.state.elements.message.value }
      	      </div>
      		    <label htmlFor="usr_id" className="sr-only">Client ID</label>
      		      <input type="id" name="usr_id" onChange={this.handleChange} value={this.state.elements.usr_id.value} className={this.state.elements.usr_id.classNames} placeholder="Client ID" required autoFocus />
      		    <label htmlFor="usr_pwd" className="sr-only">Client Secret</label>
      		      <input type="password" name="usr_pwd" onChange={this.handleChange} value={this.state.elements.usr_pwd.value} className={this.state.elements.usr_pwd.classNames} placeholder="Client Secret" required />
      		    <div className="checkbox mb-3">
      	        <label>
      	         <input type="checkbox" value="remember-me" /> Remember me
      	        </label>
      		    </div>
      		    <button className={this.state.elements.btn_signin.classNames} name="btn_signin" onClick={this.handleOnClick} >{this.state.elements.btn_signin.value}</button>
      		    <button className={this.state.elements.btn_continue.classNames} name="btn_continue" type="submit">{this.state.elements.btn_continue.value}</button>
      		    <p className="mt-5 mb-3 text-muted">&copy; 2017-2019</p>
          		<input type="hidden" name="scope" value={this.inputScope.value} />
          		<input type="hidden" name="client_id" value={this.inputClientId.value} />
          		<input type="hidden" name="response_type" value={this.inputResponseType.value} />
          		<input type="hidden" name="redirect_uri" value={this.inputRedirectURL.value} />
      		</form>
      	);
    }
}

ReactDOM.render(
	<OALogin />,
    document.getElementById('root')
);
