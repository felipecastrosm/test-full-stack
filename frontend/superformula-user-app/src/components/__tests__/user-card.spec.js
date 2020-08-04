import { shallowMount } from '@vue/test-utils';
import UserCard from '../UserCard';
import { shortStringFormat } from "../../utils/date";

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
    GeolocateControl: jest.fn(),
    Map: jest.fn(() => ({
        addControl: jest.fn(),
        on: jest.fn(),
        remove: jest.fn()
    })),
    NavigationControl: jest.fn()
}));

jest.mock("../../utils/date");

const getMountedComponent = (propsData) => {
    return shallowMount(UserCard, {
        propsData
    })
};

describe('User Card', () => {

    test('renders user name', () => {
        const component = getMountedComponent({
           user: {
               name: "sample_name"
           }
        });

        expect(component.find(".user-name").text()).toBe("sample_name");
    });

    test('renders description', () => {
        const component = getMountedComponent({
            user: {
                description: "sample_description"
            }
        });

        expect(component.find(".user-description").text()).toBe("sample_description");
    });

    test('renders formatted date', () => {
        shortStringFormat.mockReturnValue("sample_formatted_date");

        const component = getMountedComponent({
            user: {
                createdAt: "sample_date"
            }
        });

        expect(component.find(".user-info p span").text()).toBe("sample_formatted_date");
    });

    test('renders image', () => {
        const component = getMountedComponent({
            user: {}
        });

        expect(component.find(".user-image img").exists()).toBeTruthy();
    });

    test('emits edit event on edit button click', async () => {
        const component = getMountedComponent({
            user: {}
        });

        await component.find("#edit-user").trigger("click");

        expect(component.emitted("edit")).toBeTruthy();
    });
})