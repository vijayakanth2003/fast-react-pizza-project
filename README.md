## Fast Pizza App

- Now the same restaurant (business) needs a simple way of allowing customers to order pizzas and get them delivered to their home
- We were hired to build the application front-end

## STEP 1 : Project Planning

- Please refer Theory_V1.pdf file

## STEP 2 : File Structure

- We'll do feature based File or Folder Structure

- i> Features Directory - Each feature will have been developed and preserved in a single folder
  This gives more organized way of Code Splitting and Easy to Read through and follow

  - features
    - User
    - Manu
    - Cart
    - Order

- ii> ui Directory - This will contain re-usable UI Components like buttons, inputs and so on.
  These components should only be presentational, and don't contain any side effects.

  - ui

- iii> Services - This contains re-usable codes which interacts with APIs

  - services
    - apiGeocoding.js
    - apiRestaurant.js

- iv> utils - This folder will contain some helper functions which can be used through out the project.
  These are all stateless helper functions. They don't create any side effects.

  - utils

    - helper.js

  - Here we'll have formatCurrency, formatDate, calcMinutesLeft functions in this file

## STEP 3 : Setting Up React router

In this step, we integrate React Router DOM v6.x (react-router-dom) to manage the navigation and routing within our React application. This version of React Router offers a more modern, declarative approach for defining routes, significantly improving both code readability and maintainability.

- React Router v6 introduces powerful features that streamline the routing experience, such as:
- Declarative Routing: Routes are now defined in a more intuitive and predictable manner, making it easier to organize and manage.
- Error Boundaries & Data Fetching: Enhanced mechanisms for managing errors and loading data asynchronously, improving user experience by providing smoother navigation and error handling.
- Dynamic Routing & Nested Layouts: Greater flexibility in managing routes, with support for dynamic and nested routes.

  ### 1. Install React Router:

  - Use React Router DOM v6.x to manage navigation in your React app.
  - It offers a declarative way to define routes, improving code readability and maintainability.

  ### 2. Setting Up Explicit Routes

  - Create a createBrowserRouter instance to define explicit routes for different app pages.
  - Example:

  ```js
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/menu',
      element: <Menu />,
      loader: menuLoader,
    },
    {
      path: '/cart',
      element: <Cart />,
    },
    {
      path: '/order/new',
      element: <CreateOrder />,
    },
    {
      path: '/order/:orderId',
      element: <Order />,
    },
  ]);

  const App = () => {
    return <RouterProvider router={router} />;
  };
  ```

  ### 3. Create App Layout:

  - Design a global layout component to manage common UI elements like the header, footer, and cart overview.
  - Use the Outlet component to render specific content based on the active route.

    - App.js

    ````js
        const router = createBrowserRouter([
        {
            element: <AppLayout />,
            errorElement: <Error />,

            children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/menu",
                element: <Menu />,
                loader: menuLoader,
                errorElement: <Error />,
            },
            { path: "/cart", element: <Cart /> },
            {
                path: "/order/new",
                element: <CreateOrder />,
                action: createOrderAction,
            },
            {
                path: "/order/:orderId",
                element: <Order />,
                loader: orderLoader,
                errorElement: <Error />,
                action: updateOrderAction,
            },
            ],
        },
        ]);
        ```

    function App() {
    return <RouterProvider router={router} />;
    }

    export default App;
    ````

    - AppLayout.js

    ```js
    const AppLayout = () => {
      return (
        <div>
          <Header />

          <main>
            <Outlet />
          </main>

          <CartOverview />
        </div>
      );
    };

    export default AppLayout;
    ```

  ### 4. Setting Up loaders

  - Pre-fetching Data

    - Loaders fetch data before a component renders, ensuring all necessary data is ready when the page loads, which prevents loading states and flickers in the UI.

    - We're using render-as-you-fetch strategy here Vs Fetch-on-Render with useEffect

    - Fetch-on-Render with useEffect will create data-loading-waterfall

  - Menu Loader
    - A loader fetches data asynchronously before the route is rendered. In this case, we load the menu data for the Menu page.
    - Example:

  ```js
  export const menuLoader = async () => {
    const menu = await getMenu();
    return menu;
  };
  ```

  - Menu.jsx

    - Use useLoaderData() to access the data loaded by the loader inside the component.
    - Example:

    ```js
    import { useLoaderData } from 'react-router-dom';
    import { getMenu } from '../../services/apiRestaurant';

    function Menu() {
      const menu = useLoaderData();

      console.log(menu);

      return <h1>Menu</h1>;
    }

    export const menuLoader = async () => {
      const menu = await getMenu();
      return menu;
    };

    export default Menu;
    ```

  ### 5. Rendering Menu Items

  - Menu.jsx

    ```js
    function Menu() {
      const menu = useLoaderData();

      return (
        <ul>
          {menu.map((item) => (
            <MenuItem key={item.id} pizza={item} />
          ))}
        </ul>
      );
    }

    export const menuLoader = async () => {
      const menu = await getMenu();
      return menu;
    };

    export default Menu;
    ```

  - MenuItem.jsx

    ```js
    function MenuItem({ pizza }) {
      const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

      return (
        <li>
          <img src={imageUrl} alt={name} />
          <div>
            <p>{name}</p>
            <p>{ingredients.join(', ')}</p>
            <div>
              {!soldOut ? <p>{formatCurrency(unitPrice)}</p> : <p>Sold out</p>}
            </div>
          </div>
        </li>
      );
    }

    export default MenuItem;
    ```

  ### 6. Setting Up Loading Animation

  - We could see some delay in UI since Fetching data from external API will take some time
  - So we could Implement a Loading Animation or Spinner to Improve the User Experience better

    - AppLayout.jsx

      ```js
      const AppLayout = () => {
        const navigation = useNavigation();
        const isLoading = navigation.state === 'loading';

        return (
          <div className="layout">
            {isLoading && <Loader />}

            <Header />

            <main>
              <Outlet />
            </main>

            <CartOverview />
          </div>
        );
      };

      export default AppLayout;
      ```

    - Loader.jsx

      ```js
      import React from 'react';

      const Loader = () => {
        return <div className="loader"></div>;
      };

      export default Loader;
      ```

  ### 7. Error handling

  - Ensuring smooth navigation and providing a good user experience when things go wrong
  - such as missing pages, failed data loading, or route mismatches.
  - React Router v6 supports error boundaries at the route level. You can define a ErrorBoundary for specific routes
  - We can render an error element with common error component

  - Error.jsx

    ```js
    import { useNavigate, useRouteError } from 'react-router-dom';

    function NotFound() {
      const navigate = useNavigate();
      const error = useRouteError();

      console.log(error);

      return (
        <div>
          <h1>Something went wrong 😢</h1>
          <p>{error.data || error.message}</p>

          <button onClick={() => navigate(-1)}>&larr; Go back</button>
        </div>
      );
    }

    export default NotFound;
    ```

  - In App.jsx

        ```js
        const router = createBrowserRouter([
        {
            element: <AppLayout />,
            errorElement: <NotFound />,

            children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/menu",
                element: <Menu />,
                loader: menuLoader,
                errorElement: <NotFound />,  // Note Error Prone Component
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/order/new",
                element: <CreateOrder />,
            },
            {
                path: "/order/:orderId",
                element: <Order />,
            },
            ],
        },
        ]);
        ```

## STEP 4 : Fetching Orders by orderId

- Now we implement functionality to fetch and display an individual order based on its orderId.

- Function to getOrder(id)

  - The function getOrder(id) uses the fetch() method to make a request to the API endpoint.
  - If the request is successful, the function parses the response and returns the order data.
  - If the request fails (i.e., the response is not OK), it throws an error with a message indicating that the order couldn't be found.

  ```js
  export async function getOrder(id) {
    const res = await fetch(
      `https://react-fast-pizza-api.onrender.com/api/order/${id}`
    );

    if (!res.ok) throw Error(`Couldn't find order #${id}`);

    const { data } = await res.json();
    return data;
  }
  ```

- orderLoader

  - React Router provides a mechanism called loaders to fetch data asynchronously before rendering a route. In this case, we create a orderLoader that fetches the order details using the orderId from the route's parameters.
  - The loader function extracts the orderId from params, calls the getOrder(id) function, and returns the order data.

  ```js
  export const orderLoader = async ({ params }) => {
    const orderId = params.orderId;
    const order = await getOrder(orderId);

    return order;
  };

  export default Order;
  ```

- router @ App.jsx

  - In the router configuration (App.jsx), we set up the route for fetching and displaying the order. The orderLoader is associated with the route that requires the orderId, and the errorElement specifies a component to show in case of an error (such as when the order is not found).
  - In this example, we use a general NotFound component to handle errors like missing orders.

```js
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,

    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <NotFound />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/order/new',
        element: <CreateOrder />,
      },
      {
        path: '/order/:orderId',
        element: <Order />,
        loader: orderLoader,
        errorElement: <NotFound />,
      },
    ],
  },
]);
```

- Order.jsx

  - Finally we comment out the placeholder order at the component, create new order variable inside it.
  - And the new order data will by supplied by useLoaderData() custom hook from react-router-dom

  ```js
  // Test ID: IIDSAT

  import { formatDate } from '../../utils/helpers';
  import { formatCurrency } from '../../utils/helpers';
  import { calcMinutesLeft } from '../../utils/helpers';
  import { getOrder } from '../../services/apiRestaurant';
  import { useLoaderData } from 'react-router-dom';

  // const order = {
  //   id: "ABCDEF",
  //   customer: "Jonas",
  //   phone: "123456789",
  //   address: "Arroios, Lisbon , Portugal",
  //   priority: true,
  //   estimatedDelivery: "2027-04-25T10:00:00",
  //   cart: [
  //     {
  //       pizzaId: 7,
  //       name: "Napoli",
  //       quantity: 3,
  //       unitPrice: 16,
  //       totalPrice: 48,
  //     },
  //     {
  //       pizzaId: 5,
  //       name: "Diavola",
  //       quantity: 2,
  //       unitPrice: 16,
  //       totalPrice: 32,
  //     },
  //     {
  //       pizzaId: 3,
  //       name: "Romana",
  //       quantity: 1,
  //       unitPrice: 15,
  //       totalPrice: 15,
  //     },
  //   ],
  //   position: "-9.000,38.000",
  //   orderPrice: 95,
  //   priorityPrice: 19,
  // };

  function Order() {
    const order = useLoaderData();

    // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
    const {
      id,
      status,
      priority,
      priorityPrice,
      orderPrice,
      estimatedDelivery,
      cart,
    } = order;
    const deliveryIn = calcMinutesLeft(estimatedDelivery);

    return (
      <div>
        <div>
          <h2>Status</h2>

          <div>
            {priority && <span>Priority</span>}
            <span>{status} order</span>
          </div>
        </div>

        <div>
          <p>
            {deliveryIn >= 0
              ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
              : 'Order should have arrived'}
          </p>
          <p>(Estimated delivery: {formatDate(estimatedDelivery)})</p>
        </div>

        <div>
          <p>Price pizza: {formatCurrency(orderPrice)}</p>
          {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
          <p>
            To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
          </p>
        </div>
      </div>
    );
  }

  export const orderLoader = async ({ params }) => {
    const orderId = params.orderId;
    const order = await getOrder(orderId);

    return order;
  };

  export default Order;
  ```

## STEP 5 : Writing Data with React Router 'Actions'

- placeOrderAction

  ```js
  export const placeOrderAction = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    // console.log(data);

    if (!data) return;

    const order = {
      ...data,
      cart: JSON.parse(data.cart),
      priority: data.priority === 'on' ? true : false,
    };

    const response = await createOrder(order);

    return redirect(`/order/${response.id}`);
  };
  ```

- createOrder Function @ apoRestaurant.js

  ```js
  const API_URL = 'https://react-fast-pizza-api.jonas.io/api';

  export async function createOrder(newOrder) {
    try {
      const res = await fetch(`${API_URL}/order`, {
        method: 'POST',
        body: JSON.stringify(newOrder),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw Error();
      const { data } = await res.json();
      return data;
    } catch {
      throw Error('Failed creating your order');
    }
  }
  ```

- Using React Router Form Component

  ```js
  <div>
    <h2>Ready to order? Let's go!</h2>

    {/* <Form method="POST" action="/order/new"> */}
    <Form method="POST">
      <div>
        <label>First Name</label>
        <input type="text" name="customer" required />
      </div>

      <div>
        <label>Phone number</label>
        <div>
          <input type="tel" name="phone" required />
        </div>
      </div>

      <div>
        <label>Address</label>
        <div>
          <input type="text" name="address" required />
        </div>
      </div>

      <div>
        <input
          type="checkbox"
          name="priority"
          id="priority"
          // value={withPriority}
          // onChange={(e) => setWithPriority(e.target.checked)}
        />
        <label htmlFor="priority">Want to yo give your order priority?</label>
      </div>

      <div>
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <button>Order now</button>
      </div>
    </Form>
  </div>
  ```

- Updating the Router @ App.jsx

  ```js
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      errorElement: <NotFound />,

      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/menu',
          element: <Menu />,
          loader: menuLoader,
          errorElement: <NotFound />,
        },
        {
          path: '/cart',
          element: <Cart />,
        },
        {
          path: '/order/new',
          element: <CreateOrder />,
          action: placeOrderAction,
        },
        {
          path: '/order/:orderId',
          element: <Order />,
          loader: orderLoader,
          errorElement: <NotFound />,
        },
      ],
    },
  ]);
  ```

- CreateOrder.jsx Component with Fake Order

  ```js
  import { useState } from 'react';
  import { Form, redirect } from 'react-router-dom';
  import { createOrder } from '../../services/apiRestaurant';

  // https://uibakery.io/regex-library/phone-number
  const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
      str
    );

  const fakeCart = [
    {
      pizzaId: 12,
      name: 'Mediterranean',
      quantity: 2,
      unitPrice: 16,
      totalPrice: 32,
    },
    {
      pizzaId: 6,
      name: 'Vegetale',
      quantity: 1,
      unitPrice: 13,
      totalPrice: 13,
    },
    {
      pizzaId: 11,
      name: 'Spinach and Mushroom',
      quantity: 1,
      unitPrice: 15,
      totalPrice: 15,
    },
  ];

  function CreateOrder() {
    // const [withPriority, setWithPriority] = useState(false);
    const cart = fakeCart;

    return (
      <div>
        <h2>Ready to order? Let's go!</h2>

        {/* <Form method="POST" action="/order/new"> */}
        <Form method="POST">
          <div>
            <label>First Name</label>
            <input type="text" name="customer" required />
          </div>

          <div>
            <label>Phone number</label>
            <div>
              <input type="tel" name="phone" required />
            </div>
          </div>

          <div>
            <label>Address</label>
            <div>
              <input type="text" name="address" required />
            </div>
          </div>

          <div>
            <input
              type="checkbox"
              name="priority"
              id="priority"
              // value={withPriority}
              // onChange={(e) => setWithPriority(e.target.checked)}
            />
            <label htmlFor="priority">
              Want to yo give your order priority?
            </label>
          </div>

          <div>
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
            <button>Order now</button>
          </div>
        </Form>
      </div>
    );
  }

  export const placeOrderAction = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    // console.log(data);

    if (!data) return;

    const order = {
      ...data,
      cart: JSON.parse(data.cart),
      priority: data.priority === 'on' ? true : false,
    };

    const response = await createOrder(order);

    return redirect(`/order/${response.id}`);
  };

  export default CreateOrder;
  ```

- Error Handling with Phone Number

  ```js
  // isValidPhone function
  const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
      str
    );

  // Place Order Action
  export const placeOrderAction = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    // console.log(data);

    // Handling Wrong or Invalid Phone Number
    const errors = {};
    if (!isValidPhone(data.phone)) {
      errors.phone =
        'Please give us your correct phone number. We might need it to contact you.';
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    }

    if (!data) return;

    const order = {
      ...data,
      cart: JSON.parse(data.cart),
      priority: data.priority === 'on' ? true : false,
    };

    // If Everything is ok, create new order and redirect
    const response = await createOrder(order);

    return redirect(`/order/${response.id}`);
  };
  ```

  ```js
  // Create Order Component
  function CreateOrder() {
    const navigation = useNavigation();
    const formError = useActionData();
    const isSubmitting = navigation.state === 'submitting';

    // const [withPriority, setWithPriority] = useState(false);
    const cart = fakeCart;

    console.log(formError);

    return (
      <div>
        <h2>Ready to order? Let's go!</h2>

        {/* <Form method="POST" action="/order/new"> */}
        <Form method="POST">
          <div>
            <label>First Name</label>
            <input type="text" name="customer" required />
          </div>

          <div>
            <label>Phone number</label>
            <div>
              <input type="tel" name="phone" required />
            </div>
            {formError?.phone && <p>{formError.phone}</p>}
          </div>

          <div>
            <label>Address</label>
            <div>
              <input type="text" name="address" required />
            </div>
          </div>

          <div>
            <input
              type="checkbox"
              name="priority"
              id="priority"
              // value={withPriority}
              // onChange={(e) => setWithPriority(e.target.checked)}
            />
            <label htmlFor="priority">
              Want to yo give your order priority?
            </label>
          </div>

          <div>
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
            <button disabled={isSubmitting}>
              {isSubmitting ? ' Placing Order' : 'Order now'}
            </button>
          </div>
        </Form>
      </div>
    );
  }
  ```

## STEP 6 : Setting Up Tailwind CSS

- What is TailwindCSS ?
  ```
  "A Utility-First" CSS Framework packed with Utility classes like flex, text-center, rotate-90, etc..
  that can be composed to build any design, directly into our markup (HTML or JSX)
  ```
- Utility-first CSS Approach :
  ```
  Writing tiny css classes with one single purpose, and then combining them to build a Entire Layour or Atomic CSS
  ```
- How to use TailwindCSS ?
  ```
  In tailwindCSS, the classes are already written for us. So we're not gonna write any new CSS. But instead use some of tailwind's hundreds of classes.
  ```
- Pros of TailwindCSS :

  - We don't need to think about names of Classes
  - No need to jump between files to write markup and styles
  - Immediately understand stylinh in any project that uses tailwind
  - Tailwind is a design system : Many design desicions have been taken for us like pre-defined colors, spacings and etc.., which makes UI looks better
  - Saves a lot of time, e.g. on responsive design
  - Docs and VS Code integration are great

- Cons of TailwindCSS :

  - Markup (HTML or JSX) looks vert unreadable, with lots of class names
  - We need to learn a lot of class names
  - We need to install and setup tailwind on each new project
  - We're giving up on "Vanilla CSS"

### TailwindCSS - STEP 1 : Setting Up

- Please visit TailwindCSS Docs for latest Installation Steps : https://tailwindcss.com/docs/installation
- Once you land on the docs page, Click on Framwork Guide
- Select Vite (Frameworks List), and Select Using React
- Follow the Steps mentioned
- Also visit : https://tailwindcss.com/docs/preflight, to know TailwindCSS auto reset on your project

## STEP 7 : Implementing Advanced REDUX and Advanced React Router

- Setting Up Store

  ```js
  import { configureStore } from '@reduxjs/toolkit';
  import userReducer from './features/user/userSlice';

  const store = configureStore({
    reducer: {},
  });

  export default store;
  ```

- Features we're going to Implement

  - ### Feature 1 : User (State or Feature)

    - We're going to need this between Header Component and CreateOrder component.
    - So lets start implementing it

      ```js
      // userSlice.js

      const initialState = {
        username: '',
      };

      const userSlice = createSlice({
        name: 'user',
        initialState: initialState,
        reducers: {
          updateName(state, action) {
            state.username = action.payload;
          },
        },
      });

      export const { updateName } = userSlice.actions;

      export default userSlice.reducer;
      ```

    - Usage of User State :

      - User Creation

      ```js
      import { useState } from 'react';
      import Button from '../../ui/Button';
      import { useDispatch } from 'react-redux';
      import { updateName } from './userSlice';
      import { useNavigate } from 'react-router-dom';

      function CreateUser() {
        const [username, setUsername] = useState('');
        const dispatch = useDispatch();
        const navigate = useNavigate();

        function handleSubmit(e) {
          e.preventDefault();

          if (!username) return;

          dispatch(updateName(username));
          navigate('/menu');
        }

        return (
          <form onSubmit={handleSubmit}>
            <p className="mb-4 text-sm text-stone-600 md:text-base">
              👋 Welcome! Please start by telling us your name:
            </p>

            <input
              type="text"
              placeholder="Your full name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input mb-8 w-72"
            />

            {username !== '' && (
              <div>
                <Button type="primary">Start ordering</Button>
              </div>
            )}
          </form>
        );
      }

      export default CreateUser;
      ```

      - Reading Username:

        - @ Username.jsx

          ```js
          import { useSelector } from 'react-redux';

          function Username() {
            const { username } = useSelector((state) => state.user);

            if (!username) return null;

            return (
              <div className="hidden text-sm font-semibold md:block">
                {username}
              </div>
            );
          }

          export default Username;
          ```

        - @ Cart.jsx

          ```js
          function Cart() {
          const { username } = useSelector((state) => state.user);
          const cart = fakeCart;

          return (
              <div className="px-4 py-3">
              <LinkButton to="/menu">&larr; Back to menu</LinkButton>

              <h2 className="mt-7 text-xl font-semibold">Your cart, {username}</h2>

              <ul className="mt-3 divide-y divide-stone-200 border-b">
                  {cart.map((item) => (
                  <CartItem item={item} key={item.key} />
                  ))}
              </ul>

          ```

        - @ CreateOrder.jsx

        ```js
            function CreateOrder() {
            const { username } = useSelector((state) => state.user);
            const navigation = useNavigation();
            const isSubmitting = navigation.state === 'submitting';

            const formErrors = useActionData();

            // const [withPriority, setWithPriority] = useState(false);
            const cart = fakeCart;

            return (
                <div className="px-4 py-6">
                <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

                {/* <Form method="POST" action="/order/new"> */}
                <Form method="POST">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">First Name</label>
                    <input
                        className="input grow"
                        type="text"
                        name="customer"
                        defaultValue={username ? username : ''}
                        required
                    />
                    </div>
        ```

  - ### Feature 2 : Cart (State or Feature)

    - Creating Cart Slice

      ```js
      import { createSlice } from '@reduxjs/toolkit';

      const initialState = {
        //   cart: [],

        cart: [
          {
            pizzaId: 12,
            name: 'Mediterranean',
            quantity: 2,
            unitPrice: 16,
            totalPrice: 32,
          },
        ],
      };

      const cartSlice = createSlice({
        name: 'cart',
        initialState,
        reducers: {
          addItem(state, action) {
            // action.payload = newItem
            state.cart.push(action.payload);
          },
          removeItem(state, action) {
            // action.payload = itemId
            state.cart = state.cart.filter(
              (item) => item.pizzaId !== action.payload
            );
          },
          clearCart(state) {
            // No need for Payload
            state.cart = [];
          },
          incrementItemQuantity(state, action) {
            const item = state.cart.find(
              (item) => item.pizzaId === action.payload
            );
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice;
          },
          decrementItemQuantity(state, action) {
            const item = state.cart.find(
              (item) => item.pizzaId === action.payload
            );
            item.quantity--;
          },
        },
      });

      export const {
        addItem,
        removeItem,
        clearCart,
        incrementItemQuantity,
        decrementItemQuantity,
      } = cartSlice.actions;

      export default cartSlice.reducer;
      ```

    - Updating store.js

      ```js
      const store = configureStore({
        reducer: {
          user: userReducer,
          cart: cartReducer,
        },
      });

      export default store;
      ```

    - addItem Action

      ```js
      import { useDispatch } from 'react-redux';
      import Button from '../../ui/Button';
      import { formatCurrency } from '../../utils/helpers';
      import { addItem } from '../cart/cartSlice';

      function MenuItem({ pizza }) {
        const dispatch = useDispatch();
        const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

        const handleAddtoCart = () => {
          const newItem = {
            pizzaId: id,
            name,
            quantity: 1,
            unitPrice,
            totalPrice: 1 * unitPrice,
          };

          dispatch(addItem(newItem));
        };

        return (
          <li className="flex gap-4 py-2">
            <img
              src={imageUrl}
              alt={name}
              className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
            />
            <div className="flex grow flex-col pt-0.5">
              <p className="font-medium">{name}</p>
              <p className="text-sm capitalize italic text-stone-500">
                {ingredients.join(', ')}
              </p>
              <div className="mt-auto flex items-center justify-between">
                {!soldOut ? (
                  <p className="text-sm">{formatCurrency(unitPrice)}</p>
                ) : (
                  <p className="text-sm font-medium uppercase text-stone-500">
                    Sold out
                  </p>
                )}

                {!soldOut && (
                  <Button type="small" onClick={handleAddtoCart}>
                    Add to cart
                  </Button>
                )}
              </div>
            </div>
          </li>
        );
      }

      export default MenuItem;
      ```

    - Total Pizza Count & Cart Amout

      - Approach 1:

        ```js
        import { useSelector } from 'react-redux';
        import { Link } from 'react-router-dom';

        function CartOverview() {
          const pizzaCount = useSelector((state) =>
            state.cart.cart.reduce((acc, item) => acc + item.quantity, 0)
          );
          const totalAmount = useSelector((state) =>
            state.cart.cart.reduce((acc, item) => acc + item.totalPrice, 0)
          );

          return (
            <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
              <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
                <span>{pizzaCount} pizzas</span>
                <span>${totalAmount}</span>
              </p>
              <Link to="/cart">Open cart &rarr;</Link>
            </div>
          );
        }

        export default CartOverview;
        ```

      - Approach 2:

        ```js
        import { useSelector } from 'react-redux';
        import { Link } from 'react-router-dom';
        import { getTotalCartValue, getTotalItemsInCart } from './cartSlice';

        function CartOverview() {
          const pizzaCount = useSelector(getTotalItemsInCart);
          const totalAmount = useSelector(getTotalCartValue);

          return (
            <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
              <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
                <span>{pizzaCount} pizzas</span>
                <span>${totalAmount}</span>
              </p>
              <Link to="/cart">Open cart &rarr;</Link>
            </div>
          );
        }

        export default CartOverview;
        ```

      - CartOverview.jsx Final

        ```js
        import { useSelector } from 'react-redux';
        import { Link } from 'react-router-dom';
        import { getTotalCartValue, getTotalItemsInCart } from './cartSlice';
        import { formatCurrency } from '../../utils/helpers';

        function CartOverview() {
          const pizzaCount = useSelector(getTotalItemsInCart);
          const totalAmount = useSelector(getTotalCartValue);

          if (pizzaCount === 0) return null;

          return (
            <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
              <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
                <span>{pizzaCount} pizzas</span>
                <span>{formatCurrency(totalAmount)}</span>
              </p>
              <Link to="/cart">Open cart &rarr;</Link>
            </div>
          );
        }

        export default CartOverview;
        ```

      - Cart.jsx - Replacing fakeCart

        ```js
        import { Link } from 'react-router-dom';
        import LinkButton from '../../ui/LinkButton';
        import Button from '../../ui/Button';
        import CartItem from './CartItem';
        import { useSelector } from 'react-redux';
        import { getCart } from './cartSlice';

        function Cart() {
          const { username } = useSelector((state) => state.user);
          const cart = useSelector(getCart);

          return (
            <div className="px-4 py-3">
              <LinkButton to="/menu">&larr; Back to menu</LinkButton>

              <h2 className="mt-7 text-xl font-semibold">
                Your cart, {username}
              </h2>

              <ul className="mt-3 divide-y divide-stone-200 border-b">
                {cart.map((item) => (
                  <CartItem item={item} key={item.key} />
                ))}
              </ul>

              <div className="mt-6 space-x-2">
                <Button to="/order/new" type="primary">
                  Order pizzas
                </Button>

                <Button type="secondary">Clear cart</Button>
              </div>
            </div>
          );
        }

        export default Cart;
        ```

    - Clear Cart Functionality @ Cart.jsx

      ```HTML
          <Button type="secondary" onClick={() => dispatch(clearCart())}>
              Clear cart
          </Button>
      ```

      - Cart.jsx - Final

        ```js
        import { Link } from 'react-router-dom';
        import LinkButton from '../../ui/LinkButton';
        import Button from '../../ui/Button';
        import CartItem from './CartItem';
        import { useDispatch, useSelector } from 'react-redux';
        import { clearCart, getCart } from './cartSlice';
        import EmptyCart from './EmptyCart';

        function Cart() {
          const { username } = useSelector((state) => state.user);
          const cart = useSelector(getCart);
          const dispatch = useDispatch();

          if (!cart.length) return <EmptyCart />;

          return (
            <div className="px-4 py-3">
              <LinkButton to="/menu">&larr; Back to menu</LinkButton>

              <h2 className="fontf-semibold mt-7 text-xl">
                Your cart, {username}
              </h2>

              <ul className="mt-3 divide-y divide-stone-200 border-b">
                {cart.map((item) => (
                  <CartItem item={item} key={item.key} />
                ))}
              </ul>

              <div className="mt-6 space-x-2">
                <Button to="/order/new" type="primary">
                  Order pizzas
                </Button>

                <Button type="secondary" onClick={() => dispatch(clearCart())}>
                  Clear cart
                </Button>
              </div>
            </div>
          );
        }

        export default Cart;
        ```

    - Delete Item Functionality

      - Deleting Item from Cart - CartItem.jsx

        ```js
        import { useDispatch } from 'react-redux';
        import Button from '../../ui/Button';
        import { formatCurrency } from '../../utils/helpers';
        import { removeItem } from './cartSlice';
        import DeleteItem from './DeleteItem';

        function CartItem({ item }) {
          const dispatch = useDispatch();
          const { pizzaId, name, quantity, totalPrice } = item;

          return (
            <li className="py-3 sm:flex sm:items-center sm:justify-between">
              <p className="mb-1 sm:mb-0">
                {quantity}&times; {name}
              </p>
              <div className="flex items-center justify-between sm:gap-6">
                <p className="text-sm font-bold">
                  {formatCurrency(totalPrice)}
                </p>

                {/* <Button type="small" onClick={() => dispatch(removeItem(pizzaId))}>
                    Delete
                    </Button> */}

                <DeleteItem onClick={() => dispatch(removeItem(pizzaId))} />
              </div>
            </li>
          );
        }

        export default CartItem;
        ```

      - Deleting Item from Cart - MenuItem.jsx

        - Reducer to get Item Quantity By ID
          ```js
          export const getCurrentQuantityByID = (id) => (state) =>
            state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
          ```
        - Conditionally rendering Delete and Add to Cart Buttons

          ```js
          import { useDispatch, useSelector } from 'react-redux';
          import Button from '../../ui/Button';
          import { formatCurrency } from '../../utils/helpers';
          import {
            addItem,
            getCurrentQuantityByID,
            removeItem,
          } from '../cart/cartSlice';
          import DeleteItem from '../cart/DeleteItem';

          function MenuItem({ pizza }) {
            const dispatch = useDispatch();
            const { id, name, unitPrice, ingredients, soldOut, imageUrl } =
              pizza;
            const currentQuantity = useSelector(getCurrentQuantityByID(id));

            const handleAddtoCart = () => {
              const newItem = {
                pizzaId: id,
                name,
                quantity: 1,
                unitPrice,
                totalPrice: 1 * unitPrice,
              };

              dispatch(addItem(newItem));
            };

            return (
              <li className="flex gap-4 py-2">
                <img
                  src={imageUrl}
                  alt={name}
                  className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
                />
                <div className="flex grow flex-col pt-0.5">
                  <p className="font-medium">{name}</p>
                  <p className="text-sm capitalize italic text-stone-500">
                    {ingredients.join(', ')}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    {!soldOut ? (
                      <p className="text-sm">{formatCurrency(unitPrice)}</p>
                    ) : (
                      <p className="text-sm font-medium uppercase text-stone-500">
                        Sold out
                      </p>
                    )}

                    {currentQuantity > 0 ? (
                      <DeleteItem onClick={() => dispatch(removeItem(id))} />
                    ) : (
                      !soldOut && (
                        <Button type="small" onClick={handleAddtoCart}>
                          Add to cart
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </li>
            );
          }

          export default MenuItem;
          ```

    - Modifying Cart Item Quantity

      - Getting the Current Quantity of Item

        ```js
        export const getCurrentQuantityByID = (id) => (state) =>
          state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
        ```

      - UpdateItemQuantity.jsx - Updating (Increasing or Reducing Item quantity in the Cart)

        ```js
        import React from 'react';
        import Button from '../../ui/Button';
        import { useDispatch } from 'react-redux';
        import {
          decrementItemQuantity,
          incrementItemQuantity,
          removeItem,
        } from './cartSlice';

        const UpdateItemQuantity = ({ pizzaId, currentQuantity }) => {
          const dispatch = useDispatch();

          return (
            <div className="flex items-center gap-1 md:gap-3">
              <Button
                type="round"
                onClick={() => dispatch(decrementItemQuantity(pizzaId))}
              >
                -
              </Button>

              <span className="text-sm font-bold">{currentQuantity}</span>

              <Button
                type="round"
                onClick={() => dispatch(incrementItemQuantity(pizzaId))}
              >
                +
              </Button>
            </div>
          );
        };

        export default UpdateItemQuantity;
        ```

      - Adding Update Quantity component to CartItem.jsx

        ```js
        import { useDispatch } from 'react-redux';
        import Button from '../../ui/Button';
        import { formatCurrency } from '../../utils/helpers';
        import { getCurrentQuantityByID, removeItem } from './cartSlice';
        import DeleteItem from './DeleteItem';
        import UpdateItemQuantity from './UpdateItemQuantity';

        function CartItem({ item }) {
          const dispatch = useDispatch();
          const { pizzaId, name, quantity, totalPrice } = item;

          return (
            <li className="py-3 sm:flex sm:items-center sm:justify-between">
              <p className="mb-1 sm:mb-0">
                {quantity}&times; {name}
              </p>
              <div className="flex items-center justify-between sm:gap-6">
                <p className="text-sm font-bold">
                  {formatCurrency(totalPrice)}
                </p>

                {/* <Button type="small" onClick={() => dispatch(removeItem(pizzaId))}>
                    Delete
                    </Button> */}

                <UpdateItemQuantity
                  pizzaId={pizzaId}
                  currentQuantity={quantity}
                />

                <DeleteItem onClick={() => dispatch(removeItem(pizzaId))} />
              </div>
            </li>
          );
        }

        export default CartItem;
        ```

      - Adding Update Quantity component to MenuItem.jsx

        ```js
        import { useDispatch, useSelector } from 'react-redux';
        import Button from '../../ui/Button';
        import { formatCurrency } from '../../utils/helpers';
        import {
          addItem,
          getCurrentQuantityByID,
          removeItem,
        } from '../cart/cartSlice';
        import DeleteItem from '../cart/DeleteItem';
        import UpdateItemQuantity from '../cart/UpdateItemQuantity';

        function MenuItem({ pizza }) {
          const dispatch = useDispatch();
          const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
          const currentQuantity = useSelector(getCurrentQuantityByID(id));

          const handleAddtoCart = () => {
            const newItem = {
              pizzaId: id,
              name,
              quantity: 1,
              unitPrice,
              totalPrice: 1 * unitPrice,
            };

            dispatch(addItem(newItem));
          };

          return (
            <li className="flex gap-4 py-2">
              <img
                src={imageUrl}
                alt={name}
                className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
              />
              <div className="flex grow flex-col pt-0.5">
                <p className="font-medium">{name}</p>
                <p className="text-sm capitalize italic text-stone-500">
                  {ingredients.join(', ')}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  {!soldOut ? (
                    <p className="text-sm">{formatCurrency(unitPrice)}</p>
                  ) : (
                    <p className="text-sm font-medium uppercase text-stone-500">
                      Sold out
                    </p>
                  )}
                  {currentQuantity > 0 && (
                    <>
                      <UpdateItemQuantity
                        pizzaId={id}
                        currentQuantity={currentQuantity}
                      />
                      <DeleteItem onClick={() => dispatch(removeItem(id))} />
                    </>
                  )}

                  {!soldOut && !currentQuantity > 0 && (
                    <Button type="small" onClick={handleAddtoCart}>
                      Add to cart
                    </Button>
                  )}
                </div>
              </div>
            </li>
          );
        }

        export default MenuItem;
        ```

  - ### Feature 3 : Order
