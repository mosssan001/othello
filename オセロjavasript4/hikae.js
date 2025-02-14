class BOARD {
    constructor(){
       this.board = document.querySelector('.board');


        this.sqs = new Array(64);

       for(let i=0; i<64; i++){
            // マス作る
            let sq = document.createElement('div');
            sq.className = "sq";
            sq.id = i;

            let y = Math.floor(i/8) * 26 + 10;                
            sq.style.top = y + "px";

            let x = (i % 8) * 26 + 10;     
            sq.style.left = x + "px";

            this.board.appendChild(sq);

            // disc作る
            let disc = document.createElement("div");
            disc.className = "disc";
            disc.style.display = "none";
            sq.appendChild(disc);       

            sq.disc = disc;
            sq.discNo = 0;

            this.turn = 1;

            // clickイベント作る
            sq.parent = this;
            sq.addEventListener('click',function(){
                // this.parent.update(this.id);
                this.parent.onClick(this.id);
            });

            this.sqs[i] = sq;
            }
       }
       onClick(id){
        let x = id % 8;
        let y = Math.floor(id/8);
        othello.move(x,y);
       }
       update(othello){
        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){
                this.setDisc(x,y,othello.get(x,y));
            }
        }       
       }

       setDisc(x,y,d){
        let p = y * 8 + x;
        this.sqs[p].disc.style.display =  d > 0 ? "block":"none";
        this.sqs[p].disc.style.backgroundColor = d == 1 ? "black":"white";
       }
}


class OTHELLO {
    constructor(){
        this.bd = new Array(91);

        for(let i=0; i<9; i++){
            this.bd[i]=8;
        }

        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){
                this.bd[this.posi(x,y)]=0;
            }
        }

        this.bd[this.posi(3,4)] = 1;
        this.bd[this.posi(4,4)] = 2;
        this.bd[this.posi(3,3)] = 2;
        this.bd[this.posi(4,3)] = 1;
    
        this.turn=1;

    }

    posi(x,y){return (y+1) * 9 + x + 1;}
    pos_x(p){ return  p % 9 - 1;}
    pos_y(p){ return  Math.floor(p/9) - 1;}
    // bdの全valueをget
    get(x,y){ return this.bd[this.posi(x,y)];}
    move(x,y){
        let p = this.posi(x,y);
        if(this.bd[p] != 0){
            return 0;
        }

        let totalFlip = 0;
        let teki = this.turn == 1 ? 2:1;

            for(let i=0; i<VECT.length; i++){

                let vect = VECT[i];
                let n = p+vect;
                let flipcount = 0;

                while(this.bd[n]==teki){
                    flipcount++;
                    n+=vect;
                }

                if(flipcount>0 && this.bd[n]==this.turn){
                    for(let i=0; i<flipcount; i++){
                        n-=vect;
                        this.bd[n]=this.turn;
                    }
                    totalFlip += flipcount;
                }
            }
            
            if(totalFlip>0){
                this.bd[p] = this.turn;
                setUp();
                this.setNextTurn();
            }
    }

    canMove(x,y,turn){
        let p = this.posi(x,y,turn);
        if(this.bd[p] != 0){
            return 0;
        }
        let teki = turn == 1 ? 2:1;
        for(let i=0; i<VECT.length; i++){

            let vect = VECT[i];
            let n = p+vect;
            let flipcount = 0;


            while(this.bd[n]==teki){
                flipcount++;
                n+=vect;
            }
            if(flipcount>0 && this.bd[n]==turn){
                return true;
            }  
        }

        return false;

    }

    setNextTurn(){
        this.turn = this.turn == 1 ? 2:1;
        if(this.isPass(this.turn)){
            this.turn = this.turn == 1 ? 2:1;
            console.log("pass成功");
            if(this.isPass(this.turn)){
                return 0;                
            }
        }
    }

    isPass(turn){
        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){
                if(this.canMove(x,y,turn)){
                    return false;
                }   
            }
        }
        return true;
    }
}

const VECT=[-10,-9,-8,-1,1,10,9,8];
let board = new BOARD();
let othello = new OTHELLO();


function setUp(){
    board.update(othello)
}

setUp();