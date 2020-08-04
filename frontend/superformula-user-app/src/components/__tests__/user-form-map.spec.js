import { shallowMount } from '@vue/test-utils';
import UserFormMap from "@/components/UserFormMap";
import { MglMap, MglMarker } from "vue-mapbox";

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
    GeolocateControl: jest.fn(),
    Map: jest.fn(() => ({
        addControl: jest.fn(),
        on: jest.fn(),
        remove: jest.fn()
    })),
    NavigationControl: jest.fn()
}));

const getMountedComponent = (propsData, data, mocks) => {
    return shallowMount(UserFormMap, {
        propsData,
        data,
        mocks
    })
};

describe('User Form Map', () => {
    test('does not render map if there are no coordinates', async () => {
        const component = getMountedComponent({
            coordinates: []
        });

        expect(component.findComponent({name: "MglMap"}).exists()).toBeFalsy();
    });

    test('renders map if coordinates are set', async () => {
        const component = getMountedComponent({
            coordinates: [1, 2]
        });

        expect(component.findComponent(MglMap).exists()).toBeTruthy();
    });

    test('renders marker with coordinates', async () => {
        const component = getMountedComponent({
            coordinates: [1, 2]
        });

        expect(component.findComponent(MglMarker).exists()).toBeTruthy();
        expect(component.findComponent(MglMarker).props("coordinates")).toEqual([1, 2]);
    });
});