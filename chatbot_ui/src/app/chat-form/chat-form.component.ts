import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, Renderer2 } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ChatService } from "../chat.service";
import { LoginComponent } from "../login/login.component";
import { NgbModal, NgbPopover, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Content } from "@angular/compiler/src/render3/r3_ast";
import { FormBuilder, Validators } from "@angular/forms";
import { LoginServiceService } from "../services/login-service.service";
import { UpdateService } from "../services/update.service";
import { UpdateModel } from "../model/update.model";
import { $ } from "protractor";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";


@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css']
})
export class ChatFormComponent implements OnInit {

  @ViewChild('messageBox') msgBox: ElementRef;
  @ViewChild('content') modelContent: ElementRef;
  @ViewChild('data') modelDataContent: ElementRef;
  @ViewChild('update') updateAddress: ElementRef;
  @ViewChild('addressData') displayUpdatedUserAddress: ElementRef;
  @ViewChild('div') public popover: NgbPopover;
  @ViewChild('sfonds') sfondsAccountOptons: ElementRef;
  @ViewChild('mobileNumber') mobileNumberContent: ElementRef

  @ViewChild('completeModal') completeModal: ElementRef;

  @Input() chatButton: boolean = false;
  req: string;
  response: string = "";
  innerHtml: string = "";
  chats: Chats[] = [];
  robot: string = 'BOTMAN';
  user: string = 'me';
  isDisabled: boolean = false;
  loginResponse: string = "";

  check: boolean = true
  count: number = 0;

  closeResult: string;
  model: any = {};
  loading = false;
  returnUrl: string;
  errorMsg = '';
  userData: any;
  updateUser: any = {};
  responseData: any;
  public logedInUserId: string = '';
  public id: string = '';
  public name: string = '';
  public balance: string = '';
  public inputData: string = '';
  public mobileNumber: number = 0;
  public otp: number = 0;
  showOptions: boolean = false;
  optionProductName: string;
  lastIndex: number = 0;
  getNumberFlag: boolean = false;
  isNumberSubmitted: boolean = false;
  mobileNumberMessage = "Glad to assist you. Please enter your registered 10 digit mobile number";
  isNeedOtp: boolean = false;
  mobilePattern = /[0-9\+\-\ ]/;
  primaryMessage : boolean = true;
  html = "<div><p>hello world<p><div>"
  //req: string;
  botOptionsJson : any ;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private loginComponent: LoginComponent,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private loginServiceService: LoginServiceService,
    private updateService: UpdateService,
    private route: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private elRef:ElementRef,
    private renderer: Renderer2,
    private httpService: HttpClient
  ) {
    this.readJsonOptionFile();
    // this.getStarted();
    // this.pushToChat({ message: "How may I help you...", type: "ROBO", date: new Date() , showButtonOption: false})
    this.primaryMessage = false
    // $("#bot_div_id").append(this.html);
  }

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  mobileOtpForm = this.formBuilder.group({
    mobileNumber: ['', Validators.required],
    // otp: ['', Validators.required]
  })

  updateAddressData = this.formBuilder.group({
    userId: ['', Validators.required],
    name: ['', Validators.required],
    addressLine1: ['', Validators.required],
    addressLine2: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipcode: ['', Validators.required],
    country: ['', Validators.required]
  });

  ngOnInit() {
    this.setFocus();
  }



  onSubmit(): void {
    if (this.req != "") {
      this.userRequest();
    }
  }

  botOptionsParams(params: any): void {
    this.pushToChat(this.generateChat("I want to know about what is "+params, 'USER', false));
    console.log('checking new function....' , params)
    switch(params) {
      case "My Account" : {
        this.accountOptionButtonClick();
        break;
      }
      case "Apply" : {
        this.applyButtonMethod();
        break;
      }
      case "Customer Care" : {
        this.customeCareButtonMethod();
        break;
      }
      case "Erste Products" : {
        this.ersteProductButtons();
        break;
      }
      case "Account Balance" : {
        this.getAccountBalance();
        break;
      }
      case "AccountStatement" : {
        this.getAccountStatement();
        break;
      }
      case "Mini Statement" : {
        this.getMiniStatement();
        break;
      }
      case "Credit Card Balance" : {
        this.getCreditCardBalance();
        break;
      }
      case "Credit Card Limit" : {
        this.getCreditcardLimit();
        break;
      }

    }
    if (params === "accountOptionButtonClick") {
      this.accountOptionButtonClick();
    } else if (params == "getAccountBalance") {
      this.getAccountBalance();
    }
  }

readJsonOptionFile(): void {
  this.httpService.get('../assets/botOptions.json').subscribe(
    (data: any) => {
      console.log("data-- ",data.getStartedOptions)
      this.botOptionsJson = data
      console.log("this.botOptionsJson-->",this.botOptionsJson)
      this.getStarted();
      
    },
    (err: HttpErrorResponse) => {
      console.log (err.message);
    }
  );
}

  getStarted(): void {

    
  console.log("data.getStartedOptions= ",this.botOptionsJson.getStartedOptions)
    this.pushToChat(this.generateChat( "How can I help you today? "+"<br> Get started by asking",'ROBO',false,this.botOptionsJson.getStartedOptions));
  }

  getMyAccountOptions(): void {

    console.log("data.getStartedOptions= ",this.botOptionsJson.myAccountsOptions) 
    this.pushToChat(this.generateChat("",'ROBO',false,this.botOptionsJson.myAccountsOptions));
  }

  ngAfterViewInit() {
 
  }
   
 

  getAccountBalance() {
    console.log("insisde getAccountBalance() ")
    this.myAccountButtonMethod()
  }

  getAccountStatement() {
    console.log("insisde getAccountStatement() ")
  }

  getMiniStatement() {
    console.log("insisde getMiniStatement() ")
  }

  getCreditCardBalance() {
    console.log("insisde getCreditCardBalance() ")
  }

  getCreditcardLimit() {
    console.log("insisde getCreditcardLimit() ")
  }

  accountOptionButtonClick(this) {
    
    console.log("insaide buttonClick()  ",this)
    this.getMyAccountOptions();
    
  }

  userRequest(): void {
    console.log("outside of subscribe isNeedOtp-->",this.isNeedOtp);
    this.showOptions = false;
    console.log("User Input :" + this.req);
    this.inputData = this.req;
    this.isDisabled = true;
    this.pushToChat(this.generateChat(this.req, 'USER', false));

    this.chatService
      .sendData(this.req)
      .subscribe(data => {
        console.info(data);
        if (data) {
          this.loginResponse = data.message;
          if (this.loginResponse == "login modal" && this.count == 0) {
            // this.open(this.mobileNumberContent);
            this.getNumberFlag = true;
          } else if (this.loginResponse == "update modal") {
            if (this.count == 0) {
              alert("User Not LogedIn ! Please Login...")
            } else {
              this.updateAddressData.patchValue({ userId: this.logedInUserId })
              this.open(this.updateAddress)
            }
          }
          if (this.req.includes("sfonds") && data.message != "hi") {
            this.showOptions = true;
            this.optionProductName = "sFonds";
          }
          if (this.req.includes("giro") && data.message != "") {
            this.showOptions = true;
            this.optionProductName = "Giro";
          }
          if (this.req.includes("student") && data.message != "") {
            this.showOptions = true;
            this.optionProductName = "Student";
          }
          this.req = "";
          console.log("System output :");
          console.log(data);
          console.info(this.chats);
          if(this.showOptions == true){

            this.pushToChat(this.generateChat(data.message, 'ROBO', true ));
          }

          if(this.count > 0 && data.message == 'login modal'){
            if(this.inputData != 'login'){
              this.open(this.modelDataContent);
              this.pushToChat(this.generateChat("Account balance displayed...", 'ROBO', true));
            }else{
            this.pushToChat(this.generateChat("User Already LogedIn...", 'ROBO', false));
            }
          }
          else if (data.message == 'login modal') {
            data.message = "";
            console.log("chatbotEnums.mobile-->",this.mobileNumberMessage)
            data.message = this.mobileNumberMessage;
            this.isNeedOtp = true;
            this.pushToChat(this.generateChat(data.message, 'ROBO', false ));
          }else if(data.message == 'valid number'){
            console.log("mobile number accepted");
            // this.submitNumber(this.req);
            console.log("mobileNumber-- ",this.mobileNumber+ "  otp-- ",this.otp)
            data.message = "Please enter the OTP sent to your mobile number "
            this.pushToChat(this.generateChat(data.message, 'ROBO', false ));
            this.isNeedOtp = false;
          }else if(data.message == 'valid otp'){
            console.log("otp accepted");
            data.message = "valid OTP " 
            this.open(this.modelDataContent);
            this.pushToChat(this.generateChat(data.message, 'ROBO', false ));
            this.isNeedOtp = false;
          } else if (data.message == "account details") {
            this.userData = data;
            console.log("acc details-->",this.userData.result)

            this.id = this.userData.result.id;
            this.name = this.userData.result.name;
            this.balance = this.userData.result.balance;
            console.log("acc details-->"+this.id+ "  "+this.name+ "  "+this.balance)
            this.pushToChat(this.generateChat("<b> &nbsp; User Id: </b>"+ this.id+ "<br><b> &nbsp; User Name: </b>"+this.name+ "<br><b> &nbsp; Balance: </b>"+this.balance, 'ROBO', false));
          }

          else if(this.showOptions != true) {
            this.pushToChat(this.generateChat(data.message, 'ROBO', false));
          }
          this.isDisabled = false;
          this.setFocus();
        }
      })

  }

  setFocus(): void {
    setTimeout(() => {
      this.msgBox.nativeElement.focus();
    });
  }

  pushToChat(chat: Chats): void {
    console.log(this.chats.length - 1)
    this.lastIndex = this.chats.length - 1;
    this.chats.push(chat);
    console.log('>>>>',this.chats)

  }

  generateChat(message: string, type: string, showButtonOption: boolean, botOptions?: any): Chats {
    return { message: message, type: type, date: new Date() , showButtonOption : showButtonOption , botOptions: botOptions}
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    return null
  }

  login() {
    console.log(this.loginForm.value)
    this.loginServiceService.login(this.loginForm.value).subscribe(
      (response) => {
        console.log("success", response);
        this.userData = response;
        this.id = this.userData.result.id;
        this.name = this.userData.result.name;
        this.balance = this.userData.result.balance;
        this.loginForm.reset();
        if (this.userData != null) {
          this.logedInUserId = this.userData.result.userId;
          this.open(this.modelDataContent);
          this.count++
        }
      },
      (error) => {
        this.errorMsg = error.statusText
      }
    )
  }

  submitNumber(mobileRequest) {
    console.log("mobileRequest->",mobileRequest)
    // service call
    // console.log(this.mobileOtpForm.value)
    this.chatService.getOtp(mobileRequest).subscribe(
      (response)=> {
        console.log("otp call success", response);
        this.userData = response;
        this.mobileNumber = this.userData.result.mobileNumber;
        this.otp = this.userData.result.otpNumber;
        console.log("mobileNumber-- ",this.mobileNumber+ "  otp-- ",this.otp)
        response.message = "Please enter the OTP sent to your mobile number " + this.mobileNumber
        this.pushToChat(this.generateChat(response.message, 'ROBO', false ));
        this.isDisabled = false;
        this.setFocus();
        this.isNeedOtp = false;

      }
    )
    // this.isNumberSubmitted = true;
  }

  myAccountButtonMethod() {
    console.log("inside myAccountButtonMethod() ")
    const message = this.mobileNumberMessage;
    this.isNeedOtp = true;
    this.pushToChat(this.generateChat(message, 'ROBO', false));
  }

  applyButtonMethod() {
    console.log("inside applyButtonMethod() ")
    let message = "Happy to answer your questions! Here are some quick links. " + 
    "Apply for a <a href='https://shop.sparkasse.at/store/home?institute=198&productCode=CAPITALPLAN&channel=03&conditionGroup=SFONDSPLAN&language=AT&entityID=A5DAA8BA-D717-40B5-88ED-AF05F2BADF6D&nfxsid=' target='_blank'>Credit card.</a><br>"+
    "Apply for a <a href = #>student Account.</a><br>"+
    "Apply for a <a href = #>iphone lease.</a><br>"+
    "Apply for a <a href = #>sFondsplan.</a><br>"+
    "Apply for a <a href = #>Giro Account.</a><br>"+
    "For others (Accounts, Loans, Insurance and Investment products), <a href=#>click here.</a>"

    this.pushToChat(this.generateChat(message, 'ROBO', false));
  }

  customeCareButtonMethod() {
    console.log("inside customeCareButtonMethod() ")
  }

  ersteProductButtons() {
    console.log("inside ersteProductButtons() ")

  }

  updateUserAddress(update: UpdateModel): void {
    console.log(this.updateAddressData.value)
    this.updateService.updateUser(this.updateAddressData.value).subscribe(
      (response) => {
        console.log("successfully update", response);
        this.responseData = response;
        console.log("---======>", this.responseData)
        this.updateAddressData.reset();
        if(this.responseData != null){
          this.open(this.displayUpdatedUserAddress);
        }
      },
      (error) => {
        this.errorMsg = error.statusText
      }
    )
  }

  yesResponse() {
    window.open('https://shop.sparkasse.at/store/home?institute=198&productCode=CAPITALPLAN&channel=03&conditionGroup=SFONDSPLAN&language=AT&entityID=A5DAA8BA-D717-40B5-88ED-AF05F2BADF6D&nfxsid=')
  }

  noResponse() {
    //this.productList = "<b>Some HTML you want to display</b>";
    //this.pushToChat(this.generateChat(this.productList, 'ROBO', false));
      this.showOptions = false;
  }
 

}

interface Chats {
  message: string;
  type: string;
  date: Date;
  showButtonOption: boolean;
  botOptions?: [{}]
}

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
}

