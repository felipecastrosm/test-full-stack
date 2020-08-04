import { shallowMount } from '@vue/test-utils';
import UserForm from '../UserForm';

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
    return shallowMount(UserForm, {
        propsData,
        data,
        mocks
    })
};

const getMockedMutationName = mutation => {
    return mutation.mock.calls[0][0].mutation.definitions[0].name.value;
}

const getMockedMutationVariables = mutation => {
    return mutation.mock.calls[0][0].variables;
}

describe('User Form', () => {
    test('renders edit title when user id exists', () => {
        const component = getMountedComponent({
            userData: {
                id: "sample_id"
            },
            searchTerm: "sample_search",
            limit: 1
        });

        expect(component.find(".user-form-container h1").text()).toBe("Edit User");
    });

    test('renders create title when no user id is present', () => {
        const component = getMountedComponent({
            userData: {},
            searchTerm: "sample_search",
            limit: 1
        });

        expect(component.find(".user-form-container h1").text()).toBe("Create User");
    });

    test('renders remove button when user id exists', () => {
        const component = getMountedComponent({
            userData: {
                id: "sample_id"
            },
            searchTerm: "sample_search",
            limit: 1
        });

        expect(component.find(".user-form-left button").exists()).toBeTruthy();
        expect(component.find(".user-form-left button").text()).toBe("Remove");
    });

    test('does not render remove button when no user id is present', () => {
        const component = getMountedComponent({
            userData: {},
            searchTerm: "sample_search",
            limit: 1
        });

        expect(component.find(".user-form-left button").exists()).toBeFalsy();
    });

    test('renders map component using coordinates', () => {
        const component = getMountedComponent({
            userData: {},
            searchTerm: "sample_search",
            limit: 1
        }, () => {
            return {
                coordinates: [1,2]
            };
        });

        expect(component.findComponent({ name: "UserFormMap" }).exists()).toBeTruthy();
        expect(component.findComponent({ name: "UserFormMap" }).props("coordinates")).toEqual([1,2]);
    });

    test('renders user name on input when present', () => {
        const component = getMountedComponent({
            userData: {
                name: "sample_name"
            },
            searchTerm: "sample_search",
            limit: 1
        });

        expect(component.find("input[name='name']").element.value).toBe("sample_name");
    });

    test('renders user address on input when present', () => {
        const component = getMountedComponent({
            userData: {
                address: "sample_address"
            },
            searchTerm: "sample_search",
            limit: 1
        });

        expect(component.find("input[name='address']").element.value).toBe("sample_address");
    });

    test('renders user description on input when present', () => {
        const component = getMountedComponent({
            userData: {
                description: "sample_description"
            },
            searchTerm: "sample_search",
            limit: 1
        });

        expect(component.find("input[name='description']").element.value).toBe("sample_description");
    });

    test('calls createUser when save button is clicked and no user id is present', async () => {
        const mutate = jest.fn().mockResolvedValue({});

        const userInfo = {
            name: "sample_name",
            dob: "sample_dob",
            address: "sample_address",
            description: "sample_description"
        };

        const component = getMountedComponent({
            userData: userInfo,
            searchTerm: "sample_search",
            limit: 1
        }, null, {
            $apollo: {
                mutate
            },
            $toast: {
                open: jest.fn()
            },
            $modal: {
                hideAll: jest.fn()
            }
        });

        await component.find(".user-form-save").trigger("click");

        expect(mutate).toBeCalled();
        expect(getMockedMutationName(mutate)).toBe("createUser");
        expect(getMockedMutationVariables(mutate).user).toEqual(userInfo);
    });

    test('calls updateUser when save button is clicked and user id is present', async () => {
        const mutate = jest.fn().mockResolvedValue({});

        const userInfo = {
            name: "sample_name",
            dob: "sample_dob",
            address: "sample_address",
            description: "sample_description"
        };

        const component = getMountedComponent({
            userData: {
                id: "sample_id",
                ...userInfo
            },
            searchTerm: "sample_search",
            limit: 1
        }, null, {
            $apollo: {
                mutate
            },
            $toast: {
                open: jest.fn()
            },
            $modal: {
                hideAll: jest.fn()
            }
        })

        await component.find(".user-form-save").trigger("click");

        expect(mutate).toBeCalled();
        expect(getMockedMutationName(mutate)).toBe("updateUser");
        expect(getMockedMutationVariables(mutate).id).toBe("sample_id");
        expect(getMockedMutationVariables(mutate).user).toEqual(userInfo);
    });

    test('calls deleteUser when remove button is clicked', async () => {
        const mutate = jest.fn().mockResolvedValue({});

        const component = getMountedComponent({
            userData: {
                id: "sample_id"
            },
            searchTerm: "sample_search",
            limit: 1
        }, null, {
            $apollo: {
                mutate
            },
            $toast: {
                open: jest.fn()
            },
            $modal: {
                hideAll: jest.fn()
            }
        })

        await component.find(".user-form-left button").trigger("click");

        expect(mutate).toBeCalled();
        expect(getMockedMutationName(mutate)).toBe("deleteUser");
        expect(getMockedMutationVariables(mutate).id).toBe("sample_id");
    });

    test('calls clearForm when cancel button is clicked', async () => {
        const modalHide = jest.fn()

        const component = getMountedComponent({
            userData: {},
            searchTerm: "sample_search",
            limit: 1
        }, null, {
            $apollo: {
                mutate: jest.fn()
            },
            $toast: {
                open: jest.fn()
            },
            $modal: {
                hideAll: modalHide
            }
        })

        await component.find(".user-form-cancel").trigger("click");

        expect(modalHide).toBeCalled();
    });
});