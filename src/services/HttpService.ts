import {Observable} from "rxjs";
import axios from 'axios';

export class HttpService{
    constructor(){

    }

    get(url, options): Observable<any>{
        return new Observable( ( observer ) => {
            axios.get( url, options )
                .then( ( response ) => {
                    observer.next( response.data );
                    observer.complete();
                } )
                .catch( ( error ) => {
                    observer.error( error );
                } );
        } );
    }

    post(url, data, options): Observable<any>{
        return new Observable( ( observer ) => {
            axios.post( url, data, options )
                .then( ( response ) => {
                    observer.next( response.data );
                    observer.complete();
                } )
                .catch( ( error ) => {
                    observer.error( error );
                } );
        } );
    }

    put(url, data, options): Observable<any>{
        return new Observable( ( observer ) => {
            axios.put( url, data, options  )
                .then( ( response ) => {
                    observer.next( response.data );
                    observer.complete();
                } )
                .catch( ( error ) => {
                    observer.error( error );
                } );
        } );
    }

    delete(url,  options): Observable<any>{
        return new Observable( ( observer ) => {
            axios.delete( url, options  )
                .then( ( response ) => {
                    observer.next( response.data );
                    observer.complete();
                } )
                .catch( ( error ) => {
                    observer.error( error );
                } );
        } );
    }
}