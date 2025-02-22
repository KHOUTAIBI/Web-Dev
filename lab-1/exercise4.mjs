"use strict";
import {Stud, FrStdt} from "./exercise3.mjs";
import {writeFileSync,openSync,readFileSync} from "fs";

export class Promo {
    constructor(){  
        this.students = [];
    }

    add(student){
        this.students.push(student);
    }

    size(){
        return this.students.length;
    }
    
    get(i){ 
        return this.students[i];
    }

    print(){
        for(const student of this.students){
            console.log(student.toString());
        }
    }
    
    write(){
        return JSON.stringify(this.students);
    }

    read(str){
        let parsed_data = JSON.parse(str);
        let reconstructed_students = [];
        for (const object of parsed_data){
            if (object.nationality === undefined){
                let student = new Stud(object.lastName,object.firstName,object.id);
                reconstructed_students.push(student)
            }
            else{
                let frStudent = new FrStdt(object.lastName,object.firstName,object.id,object.nationality);
                reconstructed_students.push(frStudent);
            }
        }
        this.students = reconstructed_students;
    }

    saveToFile(fileName){
        let fd = openSync(fileName, 'w');
        let written = writeFileSync(fd,this.write());
    }

    readFrom(fileName){
        let fd = openSync(fileName);
        let read_promotion = readFileSync(fd);
        this.read(read_promotion); 
    }   

}
