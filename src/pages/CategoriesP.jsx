import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../schema/category";
import { request } from "../server/request";

const CategoriesP = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(categorySchema) });

  const getData = useCallback(async () => {
    try {
      let { data } = await request("users", {
        params: { firstName: search } && { lastName: search },
      });
      setCategories(data);
    } catch (err) {
      toast.error(err.response.data);
    }
  }, [search]);

  useEffect(() => {
    getData();
  }, [getData]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onSubmit = async (data) => {
    try {
      const isValid = await categorySchema.isValid(data);
      if (isValid) {
        if (selected) {
          await request.put(`users/${selected}`, data);
        } else {
          await request.post("users", data);
        }
        reset();
        getData();
        closeModal();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const edit = async (id) => {
    try {
      let { data } = await request.get(`users/${id}`);
      reset(data);
      setSelected(id);
      openModal();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCategory = async (id) => {
    let check = confirm("Are you sure you want to delete this user?");
    if (check) {
      await request.delete(`users/${id}`);
      getData();
    }
  };
  console.log("Render");
  return (
    <div className="container">
      <div className="input-group my-3">
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          className="form-control"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="input-group-text" onClick={openModal}>
          Add
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Image</th>
            <th scope="col">Age</th>
            <th scope="col">Email address</th>
            <th className="text-end" scope="col">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map(
            ({ firstName, lastName, avatar, id, age, email }, index) => (
              <tr key={id}>
                <th>{index + 1}</th>
                <td>{firstName}</td>
                <td>{lastName}</td>
                <td>
                  <LazyLoadImage src={avatar} height={50} />
                </td>
                <td>{age}</td>
                <td>{email}</td>
                <td className="text-end d-flex gap-2 flex-row-reverse">
                  <button
                    className="btn btn-primary p-2"
                    onClick={() => edit(id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger p-2"
                    onClick={() => deleteCategory(id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <Modal style={{width: '400px !important'}} ariaHideApp={false} isOpen={isOpen} onRequestClose={closeModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex gap-4 justify-content-between">
            <div className="input-group mb-3">
              <input
                {...register("firstName")}
                type="text"
                className="form-control"
                placeholder="Firstname"
              />
            </div>
            {errors.firstName && (
              <p role="alert" className="text-danger">
                {errors.firstName.message}
              </p>
            )}
            <div className="input-group mb-3">
              <input
                {...register("lastName")}
                type="text"
                className="form-control"
                placeholder="LastName"
              />
            </div>
            {errors.lastName && (
              <p role="alert" className="text-danger">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div className="input-group mb-3">
            <input
              {...register("image")}
              type="text"
              className="form-control"
              placeholder="Image"
            />
          </div>
          {errors.image && (
            <p role="alert" className="text-danger">
              {errors.image.message}
            </p>
          )}
          <div className="input-group mb-3">
            <input
              {...register("age")}
              type="number"
              className="form-control"
              placeholder="Age"
            />
          </div>
          {errors.age && (
            <p role="alert" className="text-danger">
              {errors.age.message}
            </p>
          )}{" "}
          <div className="input-group mb-3">
            <input
              {...register("email")}
              type="email"
              className="form-control"
              placeholder="Email"
            />
          </div>
          {errors.email && (
            <p role="alert" className="text-danger">
              {errors.email.message}
            </p>
          )}
          <button className="btn btn-danger me-3" onClick={closeModal}>
            Close
          </button>
          <button type="submit" className="btn btn-success">
            {selected ? "Save" : "Add"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriesP;
