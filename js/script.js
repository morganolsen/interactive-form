/***    
 *      Dynamic form handler program by Morgan Olsen
 *      September 2020
 *      Treehouse Techdegree Project 3
 * 
 *      Notes to reviewer:
 *      Aims for exceeds expectations. Name, email, credit card number, zip code and CVV all
 *      have real-time error messages as well as conditional error messages.
 */

const jobSelector = document.querySelector("#title");
const otherTitleInput = document.querySelector("#other-title");
const designField = document.querySelector("#design");
const colorSelectorDiv = document.querySelector("#shirt-colors");
const activitesFieldset = document.querySelector("fieldset.activities");
const paymentSelector = document.querySelector("#payment");
const inputFields = document.querySelectorAll('input[type="text"], input[type="email"]');
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#mail");
const ccNumInput = document.querySelector("#cc-num");
const ccZipInput = document.querySelector("#zip");
const ccCvvInput = document.querySelector("#cvv");
const form = document.querySelector('form');
let subtotal = 0;


/**
 * Hides the fields that should be hidden upon page load.
 * 
 * @returns {boolean} - true when finished
 */
function hideFields() {
    document.querySelector("#other-title").style.display = 'none';
    colorSelectorDiv.style.display = 'none';
    return true;
}

/**
 * Displays or hides the text field for "other" based on the state of the "Job role" selector
 */
function updateOtherJobField() {
    if(jobSelector.value == 'other'){
        otherTitleInput.style.display = 'block';
    }else{
        otherTitleInput.style.display = 'none';
    }
}

/**
 * Formats the "color" field to show only the colors available for the given design
 * 
 * @param {string} design - The design selected
 */
function formatColorField(design = 'none')
{
    const colorSelector = document.querySelector("#color");
    const colorOptions = colorSelector.children;
    if(design === 'none')
    {
        colorSelectorDiv.style.display = 'none';
    }else{
        let searchString = '';
        if(design === 'js puns'){
            searchString = 'JS Puns shirt only';
        }else if(design === 'heart js')
        {
            searchString = 'JS shirt only';
        }

        let hasSelected = false;

        for(let i = 0; i < colorOptions.length; i++)
        {
            if(colorOptions[i].textContent.includes(searchString)){
                colorOptions[i].style.display = 'block';
                if(!hasSelected)
                {
                    colorOptions[i].selected = true;
                    hasSelected = true;
                }
            }else{
                colorOptions[i].style.display = 'none';
            }
        }
        colorSelectorDiv.style.display = 'block';
    }
}

/**
 * Disables or enables the other checkbox elements of the "activites" section based on time frames.
 * 
 * @param {element} checkbox - The input element that was checked/unchecked 
 */
function updateActivites(checkbox)
{
    /**
     * Handler function for actually disabling and enabling checkboxes
     * 
     * @param {element} checkboxToUpdate - The checkbox to enable or disable
     */
    function updateActivity(checkboxToUpdate){
        const label = checkboxToUpdate.parentNode;
        if(!checkbox.checked)
        {
            label.style.color = 'black';
            checkboxToUpdate.disabled = false;
        }else{
            label.style.color = '#999';
            checkboxToUpdate.disabled = true;
        }
    }

    const checkboxes = {
        jsFrameworks: document.querySelector('input[name=js-frameworks]'),
        jsLibs: document.querySelector('input[name=js-libs]'),
        express: document.querySelector('input[name=express]'),
        node: document.querySelector('input[name=node]'),
        buildTools: document.querySelector('input[name=build-tools]'),
        npm: document.querySelector('input[name=npm]')
    } 

    if(checkbox === checkboxes.jsFrameworks)
    {
        updateActivity(checkboxes.express);
    }else if(checkbox === checkboxes.jsLibs)
    {
        updateActivity(checkboxes.node);
    }else if(checkbox === checkboxes.express)
    {
        updateActivity(checkboxes.jsFrameworks);
    }
    else if(checkbox === checkboxes.node)
    {
        updateActivity(checkboxes.jsLibs);
    }    
}

/**
 *  Creates the span element that holds the total amount to pay for the activities.
 */
function createTotalSpan()
{
    const span = createAppendElement(activitesFieldset, 'span', 'id', 'subtotal');
    span.style.display = 'none';
}

/**
 * Updates the subtotal when a checkbox is checked or unchecked.
 * Shows the subtotal when the amount is above 0, hides it when it is equal to 0.
 * 
 * @param {element} checkbox - The checkbox element that was checked/unchecked
 */
function updateTotal(checkbox) {
    const subtotalSpan = document.querySelector("#subtotal");
    subtotalSpan.style.color = 'black';
    subtotalSpan.style.marginBottom = '10px';
    if(checkbox.checked){
        subtotal += parseInt(checkbox.dataset.cost);
    }else{
        subtotal -= parseInt(checkbox.dataset.cost);
    }

    if(subtotal > 0)
    {
        subtotalSpan.textContent = `Total: $${subtotal}\n\n`;
        subtotalSpan.style.display = 'block';
        validateInput(document.querySelector("#activities"));
    }else{
        subtotalSpan.style.display = 'none';
    }
}

/**
 * Event handler for when the payment method selector is updated.
 * Updates the section below based on which payment method is selected.
 */
function updatePaymentMethod()
{
    let paymentMethod = paymentSelector.value;
    if(paymentMethod === 'select method')
    {
        paymentMethod = 'credit-card';
        document.querySelector('#payment option[value="credit card"]').selected = true;
        document.querySelector('#payment option[value="select method"]').style.display = 'none';    
    }

    if(paymentMethod === 'credit card')
    {
        paymentMethod = 'credit-card';
    }

    document.querySelector('#credit-card').style.display = 'none';
    document.querySelector('#paypal').style.display = 'none';
    document.querySelector('#bitcoin').style.display = 'none';
    document.querySelector(`#${paymentMethod}`).style.display = 'block';
}

/**
 * Creates a new element and appends it to the given parent node.
 * Adds an optional parameter (such as textContent) and its given value.
 * 
 * @param {element} parent - The parent node to append the new element to
 * @param {string} typeName - The type of the new element
 * @param {string} parameter - An optional parameter to give the new element
 * @param {string} parameterValue - An optional value to give the parameter.
 * @returns {element} - The newly created element.
 */
function createAppendElement(parent, typeName, parameter='', parameterValue='')
{
    const element = document.createElement(typeName);
    if(parameter)
    {
        element[parameter] = parameterValue;
    }
    parent.appendChild(element);
    return element;
}

/**
 * Toggles a given error message for a given form field on or off.
 * 
 * @param {element} inputElement - The form field to toggle error message for
 * @param {boolean} toggle - Whether the error should be shown or hidden
 * @param {string} errorMessage - The error message to display
 */
function toggleFormError(inputElement, toggle, errorMessage)
{
    let errorDiv = document.querySelector(`#${inputElement.id}-error`);
    if(errorDiv)
    {
        inputElement.parentNode.removeChild(errorDiv);
    }
    inputElement.className = '';
    if(toggle)
    {
        inputElement.className = 'error';
        errorDiv = document.createElement('div');
        errorDiv.id = `${inputElement.id}-error`;
        errorDiv.textContent = errorMessage;
        errorDiv.className = 'error';
        errorDiv.style.verticalAlign = 'top';
        errorDiv.style.marginTop = '-10px';
        errorDiv.style.marginBottom = '15px';
        const parent = inputElement.parentNode;
        const sibling = inputElement.nextElementSibling;
        parent.insertBefore(errorDiv, sibling);
    }
}

/**
 * Validates a given form field, displays any error messages and returns whether the
 * form field was valid or not.
 * 
 * @param {element} inputField - The form field to validate
 * @returns {boolean} - True if the field is valid, false if not.
 */
function validateInput(inputField)
{
    let condition = true;
    let errorMessage = '';
    if(inputField.id === 'activities'){
        errorMessage = 'You must register for at least one activity.';
        const labels = inputField.children;
        let boxesChecked = 0;
        for(let i = 0; i < labels.length; i++)
        {
            const input = labels[i].querySelector("input");
            if(input && input.checked)
            {
                boxesChecked++;
            }
        }
        if(boxesChecked > 0)
        {
            condition = true;
        }else{
            condition = false;
        }
    }else if(inputField.id === 'name')
    {
        condition = nameInput.value;
        errorMessage = 'Please enter your name.';
    }else if(inputField.id === 'mail'){
        condition = /^[^@]+@[^@]+\.[a-z.]+$/i.test(inputField.value);
        if(!inputField.value)
        {
            errorMessage = 'Please enter an e-mail address.';
        }else{
            errorMessage = 'Please enter a valid e-mail address.';
        }
    }else if(paymentSelector.value === 'credit card'){
        if(inputField.id === 'cc-num'){
            condition = /^[0-9]{13,16}$/.test(inputField.value);
            if(!inputField.value)
            {
                errorMessage = 'Please enter a credit card number.';
            }else{
                errorMessage = 'Please enter a valid credit card number.';
            }
        }else if(inputField.id === 'zip'){
            condition = /^[0-9]{5}$/.test(inputField.value);
            if(!inputField.value)
            {
                errorMessage = 'Please enter a zip code.';
            }else{
                errorMessage = 'Please enter a valid zip code.';
            }
        }else if(inputField.id === 'cvv'){
            condition = /^[0-9]{3}$/.test(inputField.value);
            if(!inputField.value)
            {
                errorMessage = 'Please enter a CVV.';
            }else{
                errorMessage = 'Please enter a valid CVV.';
            }
        }
    }

    if(condition){
        toggleFormError(inputField, false);
        return true;
    }else{
        toggleFormError(inputField, true, errorMessage);
        return false;
    }
    
}

/**
 * The handler for the form submit event.
 * Prevents submission of the form if the form is not valid.
 * 
 * @param {event} e - The event object.
 */
function submitForm(e){
    let formValid = true;
    if(!validateInput(activitesFieldset)){
        formValid = false;
    }
    
    for(let i = 0; i < inputFields.length; i++)
    {
        if(!validateInput(inputFields[i])){
            formValid = false;
        }
    }

    if(!formValid){
        e.preventDefault();
    }
}

/**
 * Creates the listeners for the fields with real-time error messaging.
 */
function createBlurListeners(){
    for(let i = 0; i < inputFields.length; i++)
    {
        inputFields[i].addEventListener('blur', () => {
            validateInput(inputFields[i]);
        });
    }
}

/**
 * The event handler for the DOMContentLoaded event.
 * Loads all the necessary parts of the program when the page has finished loading
 */
function onPageLoad(){
    // Set the focus to the first field
    document.querySelector("#name").focus();

    // Hide fields that should be hidden when the page loads
    hideFields();
    formatColorField();
    createTotalSpan();
    updatePaymentMethod();

    // Event handlers
    jobSelector.addEventListener('change', () => {
        updateOtherJobField();
    });

    designField.addEventListener('change', () => {
        formatColorField(designField.value);
    });

    activitesFieldset.addEventListener('change', e => {
        updateActivites(e.target);
        updateTotal(e.target);
    });

    paymentSelector.addEventListener('change', () => {
        updatePaymentMethod();
    });

    form.addEventListener('submit', (e) => {
        submitForm(e);
    });

    createBlurListeners();
}

document.addEventListener('DOMContentLoaded', () => {
    onPageLoad();
});





