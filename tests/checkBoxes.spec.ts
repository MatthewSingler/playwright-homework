import { test, expect } from '@playwright/test';
import exp from 'constants';

test.beforeEach(async({page}) => {
    await page.goto('https://petclinic.bondaracademy.com/welcome')
})

test.describe('Checkboxes', () => {
    test.beforeEach(async ({page}) => {
        await page.getByRole('button', {name: " Veterinarians"}).click()
        await page.getByRole('link', {name: " All"}).click() //1. Select the VETERINARIANS menu item in the nav bar, then select "All"
    })

    test('validate selected speacialties', async ({page}) => {
        const vetDoctorTableHeader = page.locator('app-vet-list h2')
        await expect(vetDoctorTableHeader).toHaveText('Veterinarians') //2. Assert Veterinarians text is displayed above table
        const vetTableRowDr = page.getByRole('row', {name: " Helen Leary "})
        await vetTableRowDr.getByRole('button', {name: 'Edit Vet'}).click() //3. Select Helen Leary and click Edit Vet
        const specialtyDropdown = page.locator('.dropdown-display .selected-specialties') //4. Assert Specialties field is displayed with radiology
        await expect(specialtyDropdown).toHaveText('radiology')
        const speacialtiesDropdownArrow = page.locator('.dropdown-arrow')
        await speacialtiesDropdownArrow.click() //5. Click on dropdown
        expect(await page.getByRole('checkbox', {name: 'radiology'}).isChecked()) //6. Assert radiology is checked
        expect(await page.getByRole('checkbox', {name: 'surgery'}).isChecked()).toBeFalsy() //7. Assert that surgery and dentistrty are unchecked
        expect(await page.getByRole('checkbox', {name: 'dentistry'}).isChecked()).toBeFalsy()

        await page.getByRole('checkbox', {name: 'radiology'}).uncheck({force: true}) //8. Check surgery and uncheck radiology
        await page.getByRole('checkbox', {name: 'surgery'}).check({force: true})
        await expect(specialtyDropdown).toHaveText('surgery') //9. Assert specialties field displays surgery

        await page.getByRole('checkbox', {name: 'dentistry'}).check({force: true}) //10.Check the dentistry checkbox
        await expect(specialtyDropdown).toHaveText('surgery, dentistry') //11. Assert that specialties field displays surgery and dentistry
        await speacialtiesDropdownArrow.click()
    })

    test('select all specialties', async ({page}) => {
        const vetTableRowDr = page.getByRole('row', {name: " Rafael Ortega "}) //2. Select Rafael Ortega and click edit
        await vetTableRowDr.getByRole('button', {name: 'Edit Vet'}).click()
        const specialtyDropdown = page.locator('.dropdown-display .selected-specialties') //3. Assert Specialties field is displayed with surgery
        await expect(specialtyDropdown).toHaveText('surgery')
        const speacialtiesDropdownArrow = page.locator('.dropdown-arrow')
        await speacialtiesDropdownArrow.click() //4. Click on dropdown

        const allSpecialtiesCheckboxes = page.getByRole('checkbox')
        for(const box of await allSpecialtiesCheckboxes.all()) {
            await box.check({force: true}) //5. Check all boxes
            expect(await box.isChecked()).toBeTruthy() //6. Assert that all boxes are checked
        }
        await expect(specialtyDropdown).toHaveText('surgery, radiology, dentistry') //7. Assert all specialties are displayed
    })

    test('unselect all specialties', async ({page}) => {
        const vetTableRowDr = page.getByRole('row', {name: " Linda Douglas "}) //2. Select Linda Douglas and click edit
        await vetTableRowDr.getByRole('button', {name: 'Edit Vet'}).click()
        const specialtyDropdown = page.locator('.dropdown-display .selected-specialties') //3. Assert Specialties field is displayed with surgery, dentistry
        await expect(specialtyDropdown).toHaveText('dentistry, surgery')
        const speacialtiesDropdownArrow = page.locator('.dropdown-arrow')
        await speacialtiesDropdownArrow.click() //4. Click on dropdown

        const allSpecialtiesCheckboxes = page.getByRole('checkbox')
        for(const box of await allSpecialtiesCheckboxes.all()) {
            await box.uncheck({force: true}) //5. uncheck all boxes
            expect(await box.isChecked()).toBeFalsy() //6. Assert that all boxes are unchecked
        }
        await expect(specialtyDropdown).toHaveText('') //7. Assert no specialties are displayed
        await speacialtiesDropdownArrow.click()
    })
})