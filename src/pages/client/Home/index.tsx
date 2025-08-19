import { Button } from "@/components/ui/button";
import { ArrowRight, HomeIcon } from "lucide-react";

const Home = () => {
  return (
    <>
      <div className="w-full flex flex-col h-full gap-2 items-center justify-center">
        <div className="w-[1000px] flex flex-col h-full items-center justify-center text-center gap-6">
          <HomeIcon size={130} />
          <h1 className="text-4xl font-black">Bem vindo a página inicial</h1>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio
            laudantium enim iure quaerat nam nisi perspiciatis, ab accusamus,
            distinctio nemo voluptatum dolore id, amet earum veniam eligendi
            similique saepe architecto.
          </p>
          <a href="/">
            <Button className="flex flex-row gap-2">
              <p>Voltar para o início</p>
              <ArrowRight />
            </Button>
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
