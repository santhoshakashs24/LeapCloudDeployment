package com.fidelity.models;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.fidelity.exceptions.InsufficientBalanceException;
import com.fidelity.exceptions.NotEligibleException;

public class Portfolio {
	
	private String portfolioId;
	private BigInteger clientId;
	private String portfolioTypeName;
	private BigDecimal balance;
	private String portfolioName;
	private List<PortfolioHoldings> holdings;
	
	
//	public Portfolio(Portfolio portfolio) {
//		this.portfolioId=portfolio.portfolioId;
//		this.clientId=portfolio.clientId;
//		this.portfolioTypeName=portfolio.portfolioTypeName;
//		this.balance=portfolio.balance;
//		this.portfolioName=portfolio.portfolioName;
//		this.holdings=new ArrayList<>();
//		if(portfolio.holdings!=null) {
//			for(PortfolioHoldings h:portfolio.holdings) {
//				this.holdings.add(new PortfolioHoldings(h));
//			}
//		}
//	}
//	
	public Portfolio() {
		super();
	}

	public List<PortfolioHoldings> getHoldings() {
		return holdings;
	}
	
	public PortfolioHoldings getTheHoldingsByInstrumnentId(String instrumentId){
		List<PortfolioHoldings> heldFilter= this.holdings.stream().filter( h -> h.getInsrumentId().equals(instrumentId)).toList();
		if(heldFilter.size()==1) {	
			return heldFilter.get(0);
		}
		return null;
	}
	
	public boolean checkBuyEligibility(BigDecimal targetPrice,Integer quantity) {
		if(this.balance.compareTo(targetPrice.multiply(new BigDecimal(1.05).multiply(new BigDecimal(quantity))))<0) {
			return false;
		}
		return true;
		
	}
	
	public boolean checkSellEligibility(String instrumentId,Integer quantity) {
		PortfolioHoldings hold=this.getTheHoldingsByInstrumnentId(instrumentId);
		if(hold!=null) {
			if(hold.getQuantity().compareTo(BigInteger.valueOf(quantity))>=0) {
				return true;
			}
		}
		return false;
	}
	
	private void updateSellInstrumentData(Trade trade,PortfolioHoldings hold){
		BigInteger i=BigInteger.valueOf(trade.getQuantity());
		// we will compare the quantity in trade to the quantity hold
		if(hold.getQuantity().compareTo(i)>=0) {
			
			// adding the last update at
			hold.setLastUpdateAt(LocalDateTime.now());
			
			// reduce the holdings quantity
			hold.setQuantity(hold.getQuantity().subtract(i));
			
			// reduce the investmentPrice
			hold.setInvetsmentprice(hold.getInvetsmentprice().subtract(trade.getCashValue()));
			if(hold.getInvetsmentprice().compareTo(new BigDecimal(0))<0) {
				hold.setInvetsmentprice(new BigDecimal(0));
			}
			//System.out.println(hold);
			
			// remove that holding if user is not holding not even 1 quantity of the instrument
			if(hold.getQuantity().equals(BigInteger.valueOf(0))) {
				this.holdings.remove(hold);
			}
			
			// increment the balance
			this.balance=this.balance.add(trade.getCashValue());
		}else {
			throw new NotEligibleException("Not enough holdings");
		}
	}
	
	
	private void updateBuyInstrumentData(Trade trade,PortfolioHoldings hold) {
		
		// user balance checking
		//System.out.println("In update");
		if(this.balance.compareTo(trade.getCashValue())>=0) {
			
			// checking if the data already there, if not create 1 and add to list
			if(hold==null) {
				hold=this.getHoldingDataFromTrade(trade);
				this.holdings.add(hold);
			}else {
				hold.setQuantity(hold.getQuantity().add(BigInteger.valueOf(trade.getQuantity())));
				hold.setInvetsmentprice(hold.getInvetsmentprice().add(trade.getCashValue()));
			}
			
			// updating the balance and the holdings
			this.balance=this.balance.subtract(trade.getCashValue());
			
			// update the holding at
			hold.setLastUpdateAt(LocalDateTime.now());
			//System.out.println("Updated buy "+hold);
			
		}else {
			throw new InsufficientBalanceException("Not enough balance in account");
		}
		
	}
	
	
	public void updateHoldings(Trade trade)  {
		//List<PortfolioHoldings> heldFilter= this.holdings.stream().filter( h -> h.getInsrumentId().equals(trade.getInstrumentId())).toList();
		 PortfolioHoldings hold=this.getTheHoldingsByInstrumnentId(trade.getInstrumentId());
		 System.out.println("Goiung to updated main "+hold + trade);
		if(hold==null && trade.getDirection().equals("B")) {
			this.updateBuyInstrumentData(trade,null);
		}else if(hold!=null) {
			if(trade.getDirection().equals("S")) {
				this.updateSellInstrumentData(trade, hold);
			// doing if its buy an instrument	
			}else if(trade.getDirection().equals("B")) {
				// checking if the user has balance
				//System.out.println("Going to updated");
				this.updateBuyInstrumentData(trade,hold);
				
			}
		}else {
			throw new NotEligibleException("Bad Request");
		}
		
		//System.out.println(this.holdings);
		
	}
	public Portfolio(String portfolioId, BigInteger clientId, String portfolioTypeName, BigDecimal balance,
			String portfolioName, List<PortfolioHoldings> holdings) {
		super();
		this.portfolioId = portfolioId;
		this.clientId = clientId;
		this.portfolioTypeName = portfolioTypeName;
		this.balance = balance;
		this.portfolioName = portfolioName;
		this.holdings = holdings;
		if(this.holdings==null) {
			this.holdings=new ArrayList<>();
		}
	}
//	public Portfolio() {
//		// TODO Auto-generated constructor stub
//	}

	public String getPortfolioId() {
		return portfolioId;
	}
	public void setPortfolioId(String portfolioId) {
		this.portfolioId = portfolioId;
	}
	public BigInteger getClientId() {
		return clientId;
	}
	public void setClientId(BigInteger clientId) {
		this.clientId = clientId;
	}
	public String getPortfolioTypeName() {
		return portfolioTypeName;
	}
	public void setPortfolioTypeName(String portfolioTypeName) {
		this.portfolioTypeName = portfolioTypeName;
	}
	public BigDecimal getBalance() {
		return balance;
	}
	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}
	public String getPortfolioName() {
		return portfolioName;
	}
	public void setPortfolioName(String portfolioName) {
		this.portfolioName = portfolioName;
	}
	@Override
	public int hashCode() {
		return Objects.hash(balance, clientId, holdings, portfolioId, portfolioName, portfolioTypeName);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Portfolio other = (Portfolio) obj;
		
		if(this.holdings==null && other.holdings==null) {
			return Objects.equals(balance, other.balance) && Objects.equals(clientId, other.clientId)
					&& Objects.equals(portfolioId, other.portfolioId)
					&& Objects.equals(portfolioName, other.portfolioName)
					&& Objects.equals(portfolioTypeName, other.portfolioTypeName);
		}
		
		return Objects.equals(balance, other.balance) && Objects.equals(clientId, other.clientId)
				&& this.holdings.containsAll(other.holdings) && Objects.equals(portfolioId, other.portfolioId)
				&& Objects.equals(portfolioName, other.portfolioName)
				&& Objects.equals(portfolioTypeName, other.portfolioTypeName);
	}
	@Override
	public String toString() {
		return "Portfolio [portfolioId=" + portfolioId + ", clientId=" + clientId + ", portfolioTypeName="
				+ portfolioTypeName + ", balance=" + balance + ", portfolioName=" + portfolioName + ", holdings="
				+ holdings + "]";
	}
	
	private PortfolioHoldings getHoldingDataFromTrade(Trade trade) {
		LocalDateTime now=LocalDateTime.now();
		PortfolioHoldings hold=new PortfolioHoldings(trade.getInstrumentId(),BigInteger.valueOf(trade.getQuantity()),
				trade.getCashValue(),now,now);
		return hold;
	}

	public void setHoldings(List<PortfolioHoldings> holdings) {
		this.holdings = holdings;
	}
	
	
	

}
