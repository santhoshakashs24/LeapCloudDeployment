import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ROUTER_CONFIGURATION } from '@angular/router';
import { InstrumentCategory } from 'src/app/models/instrument-category';
import { InstrumentPrice } from 'src/app/models/instrument-price';
import { Order } from 'src/app/models/order';
import { InstrumentService } from 'src/app/services/instrument.service';
import { TradeService } from '../trade.service';
import {NgxSpinnerService} from 'ngx-spinner'
import { ToastService } from 'src/app/toast/toast.service';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { createTypeReferenceDirectiveResolutionCache } from 'typescript';

@Component({
  selector: 'app-order-instrument',
  templateUrl: './order-instrument.component.html',
  styleUrls: ['./order-instrument.component.css']
})
export class OrderInstrumentComponent implements OnInit {

  loaderMessage:string=''

  errorMessage :{[key:string]:string} ={
    'portfolioId':'',
    'instrumentCategoryId':'',
    'instrumentId':'',
    'quantity':''
  }

  canFormBeSubmitted:boolean=false;

  errorMessageTexts:{[key:string]:{[key:string]:string}}  ={
    'portfolioId':{
      'required':'Please select portfolio'
    },
    'instrumentCategoryId':{
      'required':'please select a instrument category'
    },
    'instrumentId':{
      'required':'please select a instrument to buy'
    },
    'quantity':{
      'required':'Please type quantity of selected instrument to buy',
      'min':'you need to minimum number of selected instruments as specified above',
      'max':'you can a maximum number of selected instruments as specified above'
    }
  }


  portfolios:any[]=[]
  categories: InstrumentCategory[]=[]
  instrumentsOfCategory:InstrumentPrice[]=[]
  selectedInstrument?: InstrumentPrice;
  orderInstrumentForm!: FormGroup;
  currentPortfolio:any;
  maxQuantityCanBuy:number=0;
  direction:string='B';
  instrumentParam='';

  totalPrice:number=0;

  constructor(private router:Router,private formBuilder:FormBuilder,
    private instrumentService:InstrumentService,private tradeService:TradeService,
    private spinnerSerice:NgxSpinnerService,private toastService:ToastService, private  portService:PortfolioService,
    private route:ActivatedRoute) {

      // add a method that starts the spinner, loads the user portfolio,
      // then check if route params are there
      // if there don't stop loader, load the instrument details,
      // if eligile for tha opeation , then enable only quantity and stop loader, else show error and redirect
      // if no params passed, use the same old form validations
      this.orderInstrumentForm=this.formBuilder.group({
        'portfolioId':['',Validators.required],
        'instrumentCategoryId':[{value:'',disabled:true}, Validators.required],
        'instrumentId':[{value:'',disabled:true},Validators.required],
        'quantity':[{value:0,disabled:true},Validators.required],
        'targetPrice':[{value:0,disabled:true}, Validators.required],
        'direction':[{value:'B',disabled:true}, Validators.required]
      })

   }

  ngOnInit(): void {


    this.orderInstrumentForm.get('quantity')?.valueChanges.subscribe(newQuantity=>{
      if(this.selectedInstrument){
        this.setErrorOfControl('quantity')
      }

      if(this.selectedInstrument!=undefined && this.orderInstrumentForm.get("targetPrice")!=undefined){
        this.totalPrice=newQuantity*this.orderInstrumentForm.get("targetPrice")?.value;
      }
    })



    this.portService.getPortfolioData().subscribe({
      next:(data) => {this.portfolios=data; console.log(this.portfolios)},
      error:(e) => this.toastService.showError(e)
    })


    this.instrumentService.getAllCategories().subscribe(categories=>{
      this.categories=categories;
    })

    // executing when the suer changes to another portfolio
    this.orderInstrumentForm.get('portfolioId')?.valueChanges.subscribe(portfolioId=>{
      this.currentPortfolio=this.portfolios.find(p => p.portfolio_id==portfolioId);
      // this.validateAndUpdateTheFormBySelectedInstrument
      if(this.selectedInstrument){
        this.validateAndUpdateTheFormBySelectedInstrument(this.selectedInstrument.instrument.instrumentId)
      }
      // this.enableInstrumentCategorySelect();
      this.orderInstrumentForm.get('direction')?.enable()
      this.setErrorOfControl('portfolioId')
    })

    this.orderInstrumentForm.get('direction')?.valueChanges.subscribe(value=>{
      this.direction=value
      console.log('direction changed ',value)
      // if(this.selectedInstrument){
      //   this.validateAndUpdateTheFormBySelectedInstrument(this.selectedInstrument.instrument.instrumentId)
      // }else{
      //   this.orderInstrumentForm.get('isntrumentId')?.setValue('')
      // }
      this.selectedInstrument=undefined
      this.orderInstrumentForm.get('isntrumentId')?.setValue(this.instrumentParam)
      this.orderInstrumentForm.get('instrumentId')?.updateValueAndValidity()
      this.enableInstrumentCategorySelect();
    })

    // loding the data when the user selects a particular category
    this.orderInstrumentForm.get('instrumentCategoryId')?.valueChanges.subscribe(categoryId=>{

      if(categoryId==''){
        return
      }

      // disabling the instrument selct
      this.disableInstrumentSelect()

      // set loader message
      this.loaderMessage=`instruments of selected category loading`

      // start loader
      this.spinnerSerice.show()

      // set the value of selected instrument to be empty
      if(this.instrumentParam===''){
      this.orderInstrumentForm.get('instrumentId')?.setValue('')
        this.orderInstrumentForm.get('instrumentId')?.updateValueAndValidity();

        // set the quantity to be 0 as default
        this.orderInstrumentForm.get('quantity')?.setValue(0);
        this.orderInstrumentForm.get('quantity')?.updateValueAndValidity();
        this.orderInstrumentForm.updateValueAndValidity();

        // load the error message sof the instrument and category
        this.setErrorOfControl('instrumentId')
        this.setErrorOfControl('instrumentCategoryId')

        // if the quantity is eanbled disable it
        this.disableQuantity()
        this.selectedInstrument=undefined;
        this.canFormBeSubmitted=false;
      }else{
      }


        // load the data for the category id selected
      this.instrumentService.getInstrumentsByCategory(categoryId).subscribe(
        {next: data=>{
       // console.log('instruments receied',data)
        this.instrumentsOfCategory=data;
        this.selectedInstrument=undefined;
        this.enableInstrumentSelect()
        this.canFormBeSubmitted=true
        this.spinnerSerice.hide()
        if(this.instrumentParam!==''){
        //console.log("settting to instrumnt id",this.instrumentParam)
        this.orderInstrumentForm.get('instrumentId')?.setValue(this.instrumentParam);
        this.orderInstrumentForm.get('instrumentId')?.updateValueAndValidity();
        }
      },
        error:(e)=> { this.toastService.showError(e);this.spinnerSerice.hide()},
        complete:() => this.spinnerSerice.hide()
      })
    })


    // updating the form when the user selects an instrument
    this.orderInstrumentForm.get('instrumentId')?.valueChanges.subscribe(instrumentId=>{
      //console.log("Updatijng instrument value ",instrumentId);
      if(instrumentId==''){
        return
      }

      this.validateAndUpdateTheFormBySelectedInstrument(instrumentId)

      // set the error messages
      this.setErrorOfControl('instrumentId')
      this.setErrorOfControl('quantity')
    })

    this.orderInstrumentForm.get('quantity')?.valueChanges.subscribe(newQuantity=>{
      if(this.selectedInstrument){
        this.setErrorOfControl('quantity')
      }
    })






    // if i am getting the data from the URL then
    console.log("params ", this.route.snapshot)
    if(this.route.snapshot.params['portfolioId']!==undefined){
      const portfolioId=this.route.snapshot.params['portfolioId'];
      const direction=this.route.snapshot.params['direction'];

      const categoryId='';
      const instrumentId=this.route.snapshot.params['instrumentId'];
      this.instrumentParam=instrumentId;
      console.log(portfolioId,instrumentId,direction)

      if(portfolioId=='' || instrumentId=='' || direction==''){
        return;
      }
      this.direction=this.direction

      this.portService.getPortfolioData().subscribe({
        next: (data:any[]) => { this.currentPortfolio=data.find(p => p.portfolio_id==portfolioId);
        // patching the values
          console.log(this.currentPortfolio,data,data.find(p => p.portfolio_id===portfolioId))
          if(this.currentPortfolio==null){
            this.router.navigate(['/portfolio'])
            this.toastService.showError("Portfolio Not Found")
          }

          // this.orderInstrumentForm.updateValueAndValidity();
        this.orderInstrumentForm.get('portfolioId')?.setValue(portfolioId)
        this.direction=this.route.snapshot.params['direction']
        this.orderInstrumentForm.get('direction')?.setValue(this.route.snapshot.params['direction'])
        console.log("This direction",this.direction)
        this.orderInstrumentForm.get('direction')?.updateValueAndValidity();
        this.orderInstrumentForm.get('instrumentCategoryId')?.setValue(' ')
        //this.orderInstrumentForm.get('instrumentCategoryId')?.updateValueAndValidity();
        // if()
        // checking for the eligibility


        },
      })
    }
  }


  // validate the selected instrument based on direction and change the fields
  validateAndUpdateTheFormBySelectedInstrument(instrumentId:string){

    this.selectedInstrument=this.instrumentsOfCategory.find( ip => ip.instrument.instrumentId==instrumentId)
    let maxQuantityOfUser=0
    console.log(this.selectedInstrument, this.instrumentsOfCategory);

    if(this.direction=='S' && this.selectedInstrument){
      maxQuantityOfUser=this.checkSellEligibility(this.selectedInstrument)
    }else if(this.direction=='B' && this.selectedInstrument){
      maxQuantityOfUser=this.checkBuyEligibility(this.selectedInstrument)
    }
    if(maxQuantityOfUser>0){
      this.setMaxAndMinUserTradeCapacity(maxQuantityOfUser)
      this.enableQuantity()
      if(this.direction=='B'){
        this.orderInstrumentForm.get('targetPrice')?.setValue(this.selectedInstrument?.askPrice)
      }else{
        this.orderInstrumentForm.get('targetPrice')?.setValue(this.selectedInstrument?.bidPrice)
      }

    }else{
      if(this.instrumentParam!=''){
        this.toastService.showError("Instrument Not Found");
      }
      this.selectedInstrument=undefined
      this.disableQuantity()
      console.log("error")
      this.orderInstrumentForm.get('instrumentId')?.setValue('')
    }

  }

  // validating whether the user can buy and what culd be the max and min quantity
  checkBuyEligibility(instrumentPrice:InstrumentPrice){
      // checking if the user has chosen an portfolio
      if(this.currentPortfolio){
        if(instrumentPrice){
          if(this.currentPortfolio.portfolio_balance> instrumentPrice.askPrice*instrumentPrice.instrument.minQuantity ){
            return Math.floor(this.currentPortfolio.portfolio_balance/instrumentPrice.askPrice)
          }
        }
      }
      return 0
    }

  goToHome(){
    if(confirm('Are you sure you want to leave this page?')){
      this.router.navigate(['/portfolio'])
    }

  }

  disableQuantity(){
    this.orderInstrumentForm.get('quantity')?.disable()
  }

  enableQuantity(){
    this.orderInstrumentForm.get('quantity')?.enable()
  }

  setQuantityAndUpdate(quantity:number,minValue:number,maxValue:number){

    this.orderInstrumentForm.get('quantity')?.clearValidators()
    this.orderInstrumentForm.get('quantity')?.addValidators
      ([Validators.required, Validators.min(minValue),
        Validators.max(maxValue)]);
    this.orderInstrumentForm.get('quantity')?.setValue(quantity);
    this.orderInstrumentForm.get('quantity')?.updateValueAndValidity()
    this.orderInstrumentForm.updateValueAndValidity()
  }

  disableInstrumentSelect(){
    this.orderInstrumentForm.get('instrumentId')?.disable()
  }

  enableInstrumentSelect(){
    this.orderInstrumentForm.get('instrumentId')?.enable()
  }

  enableInstrumentCategorySelect(){
    this.orderInstrumentForm.get('instrumentCategoryId')?.enable()
  }

  setMaxAndMinUserTradeCapacity(maxCapacity:number){
    if(this.selectedInstrument){
      const minQuantity=this.selectedInstrument.instrument.minQuantity
      const maxQuantity=Math.min(this.selectedInstrument.instrument.maxQuantity,maxCapacity)
      this.setQuantityAndUpdate(minQuantity,minQuantity,maxQuantity)
      this.maxQuantityCanBuy=maxQuantity
    }
  }

  checkSellEligibility(instrumentPrice:InstrumentPrice):number{
    // checking if the user has chosen an portfolio
    if(this.currentPortfolio){

      // getting the current holding of the present user
      //console.log(this.currentPortfolio.holdings)
      const holdData=this.currentPortfolio.stocks.filter( (h:any) => h.instrumentId==instrumentPrice.instrument.instrumentId)
      //console.log(holdData, instrumentPrice)
      // checking if the user has instrument
      if(holdData.length==1){

        // checking if the user has minimum quantity of instrument to sell an instrument
       // console.log(holdData[0].quantity>=instrumentPrice.instrument.minQuantity===true?'Yes':'No')
        if(holdData[0].quantity>=instrumentPrice.instrument.minQuantity){
          //console.log('eligible')
          return holdData[0].quantity
        }
      }
    }
    return 0
  }

  checktheInstrumentEligibility(instrumentPrice:InstrumentPrice):boolean{
    if(this.direction=='S'){
      return this.checkSellEligibility(instrumentPrice)>0
    }else{
      return this.checkBuyEligibility(instrumentPrice)>0
    }
  }

  setErrorOfControl(controlName:string){
    let control:AbstractControl| null =this.orderInstrumentForm.get(controlName)
    if(!control){
      return
    }
    if(control.pristine || !control.errors){
      this.errorMessage[controlName]=''
      return
    }
    let controlErrorMessage=''
    Object.keys(control.errors).forEach(errorName=>{
      controlErrorMessage+=this.errorMessageTexts[controlName][errorName];
    })
    if(control.errors){
      this.errorMessage[controlName]=controlErrorMessage
    }
  }

  orderInstrument(){
    this.loaderMessage=`Instrument ${this.selectedInstrument?.instrument.instrumentDescription} buy request id submited waiting for respons`
    this.spinnerSerice.show()
    const order=new Order(
      this.orderInstrumentForm.value['instrumentId'],
      this.orderInstrumentForm.value['quantity'],
      this.orderInstrumentForm.get('targetPrice')?.value,
      this.orderInstrumentForm.value['portfolioId'],this.direction)
    this.tradeService.buyAInstrument(order).subscribe({
      next:re=>{
      //console.log("order submitted", re)
      this.toastService.showSuccess('Order Execution Successful')
      this.spinnerSerice.hide()
      this.router.navigate(['/portfolio'])
    },
    error:(e)=>{this.toastService.showError(e);this.spinnerSerice.hide()},
    complete:() => this.spinnerSerice.hide()

    }
    )
  }

}
