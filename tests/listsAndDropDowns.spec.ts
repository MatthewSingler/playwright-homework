import { test, expect } from '@playwright/test';


test.beforeEach(async({page}) => {
    await page.goto('https://petclinic.bondaracademy.com/welcome')
})

test.describe('Lists and Dropdowns', () => {
    test.beforeEach(async ({page}) => {
        await page.getByRole('button', {name: ' Owners'}).click() //1. Select owners in nav bar and then click search
        await page.getByRole('link', {name: ' Search'}).click()
    })
test('Validate selected pet types from list', async ({page}) => {
    const petTypeMenuDropDown = page.locator('#type')
    await expect(page.locator('app-owner-list h2')).toHaveText('Owners') //2. Assert Owners text is displayed
    await page.getByRole('link', {name: "George Franklin"}).click() //3. Select first owner George Franklin
    await expect(page.locator('.ownerFullName')).toHaveText('George Franklin') //4. Assert that owner Name value displayed is George Franklin
    await (page.locator(".dl-horizontal")).filter({hasText: "Leo"}).getByRole('button', {name: "Edit Pet"}).click() //5. Click Edit button for Leo
    await expect(page.locator('h2')).toHaveText(' Pet ') //6. Assert Pet is displayed as header
    await expect(page.locator('#owner_name')).toHaveValue('George Franklin') //7. Assert that George Franklin is displsyed in owner field
    await expect(page.getByLabel('Type')).toHaveValue('cat') //8. Assert value cat is displayed in type field
    
    const pets = {
        cat: 'cat',
        dog: 'dog',
        lizard: 'lizard',
        snake: 'snake',
        bird: 'bird',
        hamster: 'hamster'
    }
    for(const pet in pets){ //9. Loop through values in dropdown and assert that every value is displayed in type field
        await petTypeMenuDropDown.filter({hasText: pet}).selectOption(pet)
        await expect(petTypeMenuDropDown).toHaveValue(pet)     
    }
})

test('Validate the pet type update', async ({page}) => {
    const petTypeMenuDropDown = page.locator('#type')
    const ownerInformationPetTypeField = page.locator('#type1')
    await expect(page.locator('app-owner-list h2')).toHaveText('Owners') //2. Assert Owners text is displayed
    await page.getByRole('row', {name: "Eduardo Rodriquez"}).getByRole('link', {name: "Eduardo Rodriquez"}).click() //3. Select owner Eduardo Rodriquez
    await page.locator(".dl-horizontal", {hasText: "Rosy"}).getByRole('button', {name: 'Edit Pet'}).click() //4. Click Edit button for Rosy
    await expect(page.getByLabel('name')).toHaveValue('Rosy') //5. Assert that Rosy is displayed in input field Name
    await expect(ownerInformationPetTypeField).toHaveValue('dog') //6. Assert value dog is displayed in type field
    await petTypeMenuDropDown.selectOption('bird') //7. Select bird from drop down menu
    await expect(ownerInformationPetTypeField).toHaveValue('bird') //8. Assert value bird is displayed in type field and dropdown
    await expect(petTypeMenuDropDown).toHaveValue('bird')
    await page.getByRole('button', {name: "Update Pet"}).click() //9. Click update pet button
    await expect(page.locator(".dl-horizontal").filter({hasText: "Rosy"}).locator('dd').nth(2)).toHaveText('bird') //10. Assert bird is in the type field
    await page.locator(".dl-horizontal", {hasText: "Rosy"}).getByRole('button', {name: 'Edit Pet'}).click() //11. Click Edit button for Rosy again and change type back to dog
    await expect(ownerInformationPetTypeField).toHaveValue('bird')
    await petTypeMenuDropDown.selectOption('dog')
    await expect(ownerInformationPetTypeField).toHaveValue('dog')
    await expect(petTypeMenuDropDown).toHaveValue('dog')
    await page.getByRole('button', {name: "Update Pet"}).click()
    await expect(page.locator(".dl-horizontal", {hasText: "Rosy"}).locator('dd').nth(2)).toHaveText('dog')
})
})