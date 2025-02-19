class BOARD {
    constructor(){
        this.createSq();
        window.addEventListener('resize',()=>{
            this.resizeSq();
        });
    }
    createSq() {
        this.board = document.querySelector(".board");
        this.sqs = new Array(64);
        let c = 0;

        for(let i=0; i<this.sqs.length; i++){
            let sq = document.createElement("div");
            sq.className = "sq";

            let disc = document.createElement("div");
            disc.className = "disc";
            disc.style.display = "none";
            sq.disc = disc;
            sq.appendChild(disc);

            this.sqs[i]= sq;
        }

        const isMobile = window.innerWidth < 768;
        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){            
                let p = this.pos_board(x,y);
                this.board.appendChild(this.sqs[p]);
                this.sqs[p].style.left = x * (isMobile ? 45.5 : 85) + (isMobile ? 10 : 30) +"px";
                this.sqs[p].style.top = y * (isMobile ? 45.5 : 85) + (isMobile ? 10 : 30) + "px";  

                this.sqs[this.pos_board(x,y)].addEventListener('click',()=>{
                    if(complaying){
                        return;
                    }
                    this.onClick(x,y);
                });
            }
        }
    }
    resizeSq(){
        const isMobile = window.innerWidth < 768;
        for(let i=0; i<64; i++){
            const x = (i % 8) * (isMobile ? 45.5 : 85) + (isMobile ? 10 : 30);
            const y = Math.floor(i / 8) * (isMobile ? 45.5 : 85) + (isMobile ? 10 : 30);
                this.sqs[i].style.top = `${y}px`;
                this.sqs[i].style.left = `${x}px`;
            }
    }
    
    byouga(othello){
        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){
                       this.sqs[this.pos_board(x,y)].disc.style.display =
                       othello.bd[othello.pos_othello(x,y)] == 0 ? "none":"block";

                    if(othello.bd[othello.pos_othello(x,y)]==1){
                        this.sqs[this.pos_board(x,y)].disc.style.backgroundColor = "black";
                    }
                    if(othello.bd[othello.pos_othello(x,y)]==2){
                        this.sqs[this.pos_board(x,y)].disc.style.backgroundColor = "white";
                    }
                }
            }
        }

    pos_board(x,y){
        return (y * 8) + x;
    }
    onClick(x,y){
        if(othello.setDisc(x,y)){
            this.byouga(othello);
            set2(othello.turn);
        }
    }
}

class OTHELLO {
    constructor(){
        this.bd = new Array(91);
        
        for(let i=0; i<91; i++){
            this.bd[i]=8;
        }

        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){
                let pos = this.pos_othello(x,y);
                this.bd[pos]=0;
            }
        }

        this.bd[this.pos_othello(3,4)] = 1;
        this.bd[this.pos_othello(3,3)] = 2;
        this.bd[this.pos_othello(4,3)] = 1;
        this.bd[this.pos_othello(4,4)] = 2;

        this.turn = 1;
        this.hand;

        this.count = 0;
        this.nowCount = 0;
        // this.latestSqs;
    }
    pos_othello(x,y){
        return (y+1)* 9 + x + 1;
    }
    p_changeX(){
        return 
    }

    setDisc(x,y){

        if(!this.canMove(x,y,this.turn)){
            return;
        }

        this.move(x,y);
        this.changeTurn();

        this.passcheck();

        return true;
    }

    passcheck(){
        if(!this.checkHands(this.turn)){
            console.log("1pass");
            this.changeTurn();        
            if(!this.checkHands(this.turn)){
                console.log("2pass = 終局");
                return 0;
            }     
        }
    }

    checkHands(turn){
        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){
                if(this.canMove(x,y,turn)){
                    return true;
                }
            }
        }
            console.log("pass");
            return false;
    }

    changeTurn(){
        this.turn = this.turn == 1 ? 2:1;
    }

    move(x,y){
        if(this.bd[this.pos_othello(x,y)]!=0){
            return;
        }

        let moveInfo = new MoveInfo();

        let nowP = this.pos_othello(x,y);
        moveInfo.posi = nowP;

        let teki = this.turn == 1 ? 2:1;
        moveInfo.teki = teki;

        let totalFlip = 0;

        for(let vect=0; vect<vects.length; vect++){
            let flipCounter=0;
            let nextP = nowP+vects[vect];

            while(this.bd[nextP]==teki){
                flipCounter++;
                nextP+=vects[vect];
            }

            if(flipCounter>0 && this.bd[nextP]==this.turn){
                this.bd[nowP]=this.turn;
                for(let i=0; i<flipCounter; i++){
                        nextP-=vects[vect];

                        moveInfo.turndisc.push(nextP);

                        moveInfo.flipCounter = flipCounter;
                        moveInfo.turn = this.turn;

                        this.bd[nextP]=this.turn; 
                    }
                totalFlip+=flipCounter;
                }

            }

            if(totalFlip<=0){
                return false;
            }

        moveInfo.count = this.count;
        MoveInfos[this.count++] = moveInfo;
        this.nowCount = this.count;    
   
        // this.latestData();
        console.log(MoveInfos);
        return true;
    }

    canMove(x,y,turn){
        if(this.bd[this.pos_othello(x,y)]!=0){
            return;
        }

        let nowP = this.pos_othello(x,y);
        let teki = turn === 1 ? 2:1;

        for(let vect=0; vect<vects.length; vect++){
            let flipCounter=0;
            let nextP = nowP+vects[vect];

            while(this.bd[nextP]===teki){
                flipCounter++;
                nextP+=vects[vect];
            }

            if(flipCounter>0 && this.bd[nextP]===turn){
                return true;
            }

        }

        return false;
    }

    unmove(){
        if(this.count<=0){
            return;
        }

        this.count--;

        let nowInfo = MoveInfos[this.count];

        let nowP = nowInfo.posi;
        this.bd[nowP] = 0;

        let teki = nowInfo.teki;

        for(let i=0; i<nowInfo.flipCounter; i++){
                this.bd[nowInfo.turndisc[i]] = teki;
            }


        this.turn = nowInfo.turn;
    }

    next(){
        if(this.count>=this.nowCount){
            return;
        }

        let nowInfo = MoveInfos[this.count];
        let nowP = nowInfo.posi;
        this.bd[nowP] = nowInfo.turn;

        for(let i=0; i<nowInfo.flipCounter; i++){
            this.bd[nowInfo.turndisc[i]] = nowInfo.turn;
        }

        this.count++;
    }

    // latestData(){
    //     this.latestSqs = new Array();

    //     for(let y=0; y<8; y++){
    //         for(let x=0; x<8; x++){
    //             let pos = this.pos_othello(x,y);
    //             this.latestSqs.push(this.bd[pos]);
    //         }
    //     }
    //     console.log(this.latestSqs);
    // }
    // allNext(){
    //     let count=0;
    //     for(let y=0; y<8; y++){
    //         for(let x=0; x<8; x++){
    //             let pos = this.pos_othello(x,y);
    //             this.bd[pos] =  this.latestSqs[count];
    //             count++;
    //             }
    //         }
    //     this.count=this.nowCount;
    // }


    allNext2(){
        for(let i=0; i<this.nowCount; i++){
            this.next();
        }
    }

    allUnmove(){
        for(let i=0; i<91; i++){
            this.bd[i]=8;
        }

        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){
                let pos = this.pos_othello(x,y);
                this.bd[pos]=0;
            }
        }

        this.bd[this.pos_othello(3,4)] = 1;
        this.bd[this.pos_othello(3,3)] = 2;
        this.bd[this.pos_othello(4,3)] = 1;
        this.bd[this.pos_othello(4,4)] = 2;

        this.turn = 1;
        this.count = 0;
    }

    comMove(x,y,turn){
        if(this.bd[this.pos_othello(x,y)]!=0){
            return;
        }

        let nowP = this.pos_othello(x,y);
        let teki = turn === 1 ? 2:1;
        let flips=0;


        for(let vect=0; vect<vects.length; vect++){
            let flipCounter=0;
            let nextP = nowP+vects[vect];

            while(this.bd[nextP]===teki){
                flipCounter++;
                nextP+=vects[vect];
            }

            if(flipCounter>0 && this.bd[nextP]===turn){
                flips+=flipCounter;
            }
        }
        return flips;
    }

    comHand(turn){
        let teMax=0;
        let com = new Com();
        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){
                if(this.comMove(x,y,turn)>0){
                    let nowHand = this.comMove(x,y,turn);
                    if(teMax<nowHand){
                        com.maxHands = nowHand;                        
                        com.comX = x;
                        com.comY = y;
                        com.comTurn = turn;
                        teMax = nowHand;
                    }
                }
            }
        }
        console.log(com);
        return com;
    }
}


function set2(turn){
    complaying = true;
    setTimeout(() => {
        set3(turn);
    }, 1500);
}

function set3(turn){
    let com = othello.comHand(turn);
    othello.move(com.comX,com.comY);
    board.byouga(othello);
    othello.changeTurn();

    if(!othello.checkHands(othello.turn)){
        console.log("1pass");
        othello.changeTurn();
        if(!othello.checkHands(othello.turn)){
            console.log("2pass = 終局");
            return 0;
        }
        set2(turn);
    }

    complaying = false;
}

class MoveInfo{
    constructor(){
        this.posi;
        this.teki;
        this.turndisc = new Array();
        this.flipCounter = 0;
        this.turn;
        this.count;
    }
}

class Com{
    constructor(){
        this.comX;
        this.comY;
        this.maxHands=0;
        this.comTurn;
    }
}

const vects = [-10,-9,-8,-1,1,8,9,10];
let board = new BOARD();
let othello = new OTHELLO();

let MoveInfos = new Array();
let coms = new Array();
let complaying;

board.byouga(othello);

function UNMOVE(){
    othello.unmove();
    board.byouga(othello);
}

function NEXT(){
    othello.next();
    board.byouga(othello);
}

function ALLNEXT(){
    othello.allNext2();
    board.byouga(othello);
}

function ALLUNMOVE(){
    othello.allUnmove();
    board.byouga(othello);
}

// 一手戻る、進む、全部戻る、全部進む
// PCで打てる手をすべて洗い出し、1：ランダムで打つ、２：トータルフリップカウントが一番多い手に打つ、の2種類のCOMを作る

