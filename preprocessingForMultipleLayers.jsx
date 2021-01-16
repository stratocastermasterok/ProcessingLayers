{
    app.beginUndoGroup("Undo")


function saveTxt(txt,myPatho)
{
    var saveFile = File(myPatho);
    if (saveFile.exists)
        saveFile.remove();

    saveFile.encoding = "UTF8";
    saveFile.open("e", "TEXT", "????");
    saveFile.writeln(txt);
    saveFile.close();
    alert("Saved!");
}


function f(array,value){
    var n = 0;
    for (i =0; i < array.length; i++)
    {
        if(parseFloat(array[i][1])== parseFloat(value)){n++}

    }
    return n;

}

var myComp = app.project.activeItem;
var selectedLayers = myComp.selectedLayers;

myString =[];


var myTimeStart=0;
var myDuration=50;
var myFPS= 1/30;
var howManyTimeItShouldShowUp=10;



for (r=0; r< selectedLayers.length; r++)
{

//go through each frame to logg the rounded values

    for (m=myTimeStart; m< myTimeStart+myDuration; m+=myFPS)
    {
        var myScalee = selectedLayers[r].property("scale").valueAtTime(m,false)[0];
        var myScale = Math.round(myScalee*100)/100;
        myString.push([m,myScale]);

    }


    //part 1 to create the reduced list of the "real" values
    var myString2 =[];

    for (p=0; p< myString.length; p++)
    {
        var xVal = myString[p][1];
        if (f(myString,xVal) >= howManyTimeItShouldShowUp)
        {
            myString2.push(myString[p]);
        }

    }
    

//part 2 to create the reduced list of "real" values
    var streamlined = [myString2[0]];
    for (ii=0; ii< (myString2.length-1); ii++)
        {
            xVal1 = myString2[ii][1];
            xVal2 = myString2[ii+1][1];
            //important line below...if its a different number, logg it
            if (xVal2!=xVal1)
            {
                streamlined.push(myString2[ii+1]);
            }

        }

       // alert(streamlined);



        var myScaleValues = selectedLayers[r].property("scale");
        myScaleValues.expression ="";


        //alert(myScaleValues.numKeys);

        for (var j=myScaleValues.numKeys; j>=1; j--)
        {
            myScaleValues.removeKey(j);
        }


        var easeArray =[];


        //creating the keyframes on scale
            for (y=0; y< streamlined.length; y++)
            {
                var myArray1= streamlined[y];
                selectedLayers[r].property("scale").setValueAtTime(myArray1[0],[myArray1[1],myArray1[1]]);
                var changed=0;


                if (y<(streamlined.length-1))
                {
                    var myArray2= streamlined[y+1];
                    selectedLayers[r].property("scale").setValueAtTime(myArray2[0]-(4/30),[myArray1[1],myArray1[1]]);

                    //creating the easing values via logic
                    changed = Math.abs(myArray2[1]-myArray1[1]);
                    var inCalc = (changed*(50/90))+50;
                    var outCalc = (changed*(30/90))+20;
                    
                    easeArray.push([inCalc,outCalc]);

                }

            }



//alert(easeArray);


    //try{
// setting the dynamic easing values
            for (gg = 1; gg< myScaleValues.numKeys+0; gg+=2)
            {
                var easeInMore = new KeyframeEase(0, easeArray[(gg-1)/2][0]);
                var easeOutMore = new KeyframeEase(0, easeArray[(gg-1)/2][1]);


                myScaleValues.setTemporalEaseAtKey(gg, [easeInMore,easeInMore,easeInMore], [easeOutMore,easeOutMore,easeOutMore]);
                myScaleValues.setTemporalEaseAtKey(gg+1, [easeInMore,easeInMore,easeInMore], [easeOutMore,easeOutMore,easeOutMore]);

               // alert("done!");



            }
      //  }
        //    catch(error)
        //    {

       //     }


//end loop going through each layer
}


app.endUndoGroup();
}