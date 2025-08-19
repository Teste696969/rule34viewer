import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = () => {
    navigate("/home");
  };

  return (
    <>
      <div className="w-full flex flex-col h-full gap-2 items-center justify-center">
        <div className="w-[1000px] flex flex-row justify-between rounded-md shadow-[0px_3px_6px_3px_rgba(0,_0,_0,_0.1)]">
          <div className="w-[50%] bg-black rounded-s-md p-10 text-white flex flex-col gap-3">
            <h1 className="text-2xl">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
              aliquam dolores aspernatur voluptatum repellat ratione nemo omnis
              esse. Atque iusto culpa veritatis voluptatibus veniam totam vero a
              debitis, distinctio error!
            </p>
          </div>
          <div className="w-[50%] p-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apelido</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu apelido..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu email..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite sua senha..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="Repita sua senha..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="w-full flex flex-col gap-6">
                  <Button type="submit">Registrar agora</Button>
                  <p className="text-sm text-gray-600">
                    Já possui uma conta?{" "}
                    <a className="text-black" href="/">
                      Entrar agora
                    </a>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
