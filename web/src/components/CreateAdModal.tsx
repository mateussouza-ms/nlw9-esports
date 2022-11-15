import * as Checkbox from "@radix-ui/react-checkbox";
import * as Dialog from "@radix-ui/react-dialog";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import axios from "axios";
import { Check, GameController } from "phosphor-react";
import { FormEvent, useEffect, useState } from "react";
import { FormInput } from "./Form/Input";

const WEEK_DAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

type Game = {
  id: string;
  title: string;
};

export function CreateAdModal() {
  const [games, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoiceChannel, setUseVoiceChannel] = useState(false);

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    if (!data.name) {
      return;
    }

    try {
      await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel: useVoiceChannel,
      });
      alert("Anúncio criado com sucesso!");
    } catch (error) {
      console.log(error);
      alert("Erro ao criar o anúncio!");
    }
  }

  useEffect(() => {
    axios
      .get("http://localhost:3333/games")
      .then((response) => setGames(response.data));
  }, []);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 fixed inset-0 " />
      <Dialog.Content className="fixed bg-[#2a2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
        <Dialog.Title className="text-3xl font-black">
          Publique um anúncio
        </Dialog.Title>
        <form className="mt-8 flex flex-col gap-4" onSubmit={handleCreateAd}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold">
              Qual o game?
            </label>
            <select
              name="game"
              id="game"
              defaultValue=""
              className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none"
            >
              <option value="" disabled>
                Selecione o game que deseja jogar
              </option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="name">
              Seu nome (ou nickname)
            </label>
            <FormInput
              name="name"
              id="name"
              placeholder="Como te chamam dentro do game?"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="name">
                Joga há quantos anos?
              </label>
              <FormInput
                name="yearsPlaying"
                id="yearsPlaying"
                type="number"
                placeholder="Tudo bem ser ZERO"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="name">
                Qual seu Discord?
              </label>
              <FormInput
                name="discord"
                id="discord"
                placeholder="Usuario#0000"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="weekDays">
                Quando costuma jogar?
              </label>
              <ToggleGroup.Root
                type="multiple"
                value={weekDays}
                className="grid grid-cols-4 gap-2"
                onValueChange={setWeekDays}
              >
                {WEEK_DAYS.map((weekDay, index) => (
                  <ToggleGroup.Item
                    key={weekDay}
                    value={String(index)}
                    title={weekDay}
                    className={`w-8 h-8 rounded ${
                      weekDays.includes(String(index))
                        ? "bg-violet-500"
                        : "bg-zinc-900"
                    }`}
                  >
                    {weekDay.slice(0, 1).toUpperCase()}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-semibold" htmlFor="hourStart">
                Qual horário do dia?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <FormInput
                  name="hourStart"
                  id="hourStart"
                  type="time"
                  placeholder="De"
                />
                <FormInput
                  name="hourEnd"
                  id="hourEnd"
                  type="time"
                  placeholder="Até"
                />
              </div>
            </div>
          </div>

          <label className="mt-2 flex items-end gap-2 text-sm">
            <Checkbox.Root
              checked={useVoiceChannel}
              onCheckedChange={(checked) =>
                setUseVoiceChannel(checked === true)
              }
              className="w-6 h-6 p-1 rounded bg-zinc-900"
            >
              <Checkbox.Indicator>
                <Check className="w-4 h-4 text-emerald-400" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            Costumo me conectar ao chat de voz
          </label>

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close
              type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600 transition-all"
            >
              Cancelar
            </Dialog.Close>
            <button
              type="submit"
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600 transition-all"
            >
              <GameController className="w-6 h-6" />
              Encontre seu duo
            </button>
          </footer>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
