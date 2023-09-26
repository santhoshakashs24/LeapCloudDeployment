package com.fidelity.service.impl;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.javassist.tools.web.BadHttpRequest;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fidelity.dao.ClientDao;
import com.fidelity.exceptions.FmtsException;
import com.fidelity.exceptions.ClientException;
import com.fidelity.models.Client;
import com.fidelity.security.JwtTokenService;
import com.fidelity.service.ClientService;
import com.fidelity.utils.FmtsClientModel;
import com.fidelity.utils.TokenDto;

@Service
public class ClientServiceImpl extends ClientService{
	
	@Autowired
	private Logger logger;
	
	@Autowired
	private ClientDao dao;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	@Autowired
	private RestTemplate restTemplate;
	
	
	@Autowired
	private JwtTokenService jwtService;

	@Override
	public Client registerNewUser(Client client) {
		// TODO Auto-generated method stub
//		logger.debug("Register New User/ Insert");
		if(this.getUserByEmail(client.getEmail())!=null) {
			throw new ClientException("Already user exist with this email");
		}
		//return dao.registerNewUser(client);
		FmtsClientModel respData = this.registerWithFmtsServer(client);	
		client.setClientId(respData.getClientId());
		dao.registerNewUser(client);
		return client;
	}

	@Override
	public TokenDto authenticateUser(String email, String password) {
		
		Client client=dao.authenticateUser(email, password);
		
		FmtsClientModel respData=this.registerWithFmtsServer(client);
		
		logger.debug("In the response uccesful");
		TokenDto token=new TokenDto();
		token.setClientName(client.getName());
		Map<String,Object> claims=new HashMap<>(); 
		claims.put("ROLE", "CLIENT");
		claims.put("fmtsToken", respData.getToken());
		token.setToken(jwtService.createToken(claims, client.getClientId()));
		token.setClientId(respData.getClientId());
		return token;
		
	}

	@Override
	public void removeUserById(BigInteger clientId) {
		// TODO Auto-generated method stub
		logger.debug("Remove User By Id");
		dao.removeUserById(clientId);
	}

	@Override
	public Client getUserById(BigInteger clientId) {
		// TODO Auto-generated method stub
		logger.debug("Get User By Id");
		return dao .getUserById(clientId);
	}

	@Override
	public Client getUserByEmail(String email) {
		// TODO Auto-generated method stub
		logger.debug("Get User By Email");
		return dao.getUserByEmail(email);
	}
	
	private FmtsClientModel registerWithFmtsServer(Client client) {
		
		HttpHeaders headers=new HttpHeaders();
		headers.add("Content-Type", "application/json");
		headers.add("Accept", "application/json");
		
		FmtsClientModel requestData=new FmtsClientModel();
		requestData.setClientId(client.getClientId());
		requestData.setEmail(client.getEmail());
		
		
		HttpEntity<FmtsClientModel> requestEntity=new HttpEntity<>(requestData,headers);
		
		ResponseEntity<String> response=null;
		try{
			logger.debug("Going to issue request");
		
			response= restTemplate.postForEntity("https://teamtm.roifmr.com/fmts/client/", requestEntity ,String.class);
			
			logger.debug(response.toString());

		}catch(Exception e) {
			throw new FmtsException("Fmts Server Error");
		}
		if(response.getStatusCode().is2xxSuccessful() && response.getBody()!=null) {
			
			FmtsClientModel respData;
			try {
				respData = objectMapper.readValue(response.getBody(), FmtsClientModel.class);
			} catch (JsonProcessingException e) {
				logger.error("Json Decoder error from fmts server",e);
				throw new RuntimeException("JSON Error");
			}
			
			return respData;
		}else  {
			throw new RuntimeException("Invalid authentication data");
		}
	}

}
