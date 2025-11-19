import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  rendimento: z.string().min(1, "Informe o rendimento"),
  precoVenda: z.string().min(1, "Informe o preço de venda"),
  modoPreparo: z.string().min(10, "Modo de preparo deve ter pelo menos 10 caracteres").max(1000),
  tempoPreparo: z.string().min(1, "Informe o tempo de preparo"),
});

interface FichaTecnicaFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function FichaTecnicaForm({ onSuccess, initialData }: FichaTecnicaFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          nome: initialData.nome,
          rendimento: initialData.rendimento.toString(),
          precoVenda: initialData.precoVenda.toString(),
          modoPreparo: initialData.modoPreparo,
          tempoPreparo: initialData.tempoPreparo.toString(),
        }
      : {
          nome: "",
          rendimento: "",
          precoVenda: "",
          modoPreparo: "",
          tempoPreparo: "",
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: initialData ? "Ficha técnica atualizada!" : "Ficha técnica adicionada!",
      description: initialData
        ? "A ficha técnica foi atualizada com sucesso."
        : "A ficha técnica foi adicionada com sucesso.",
    });
    form.reset();
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Prato</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Risoto de Funghi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="rendimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rendimento (porções)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="precoVenda"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Venda (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tempoPreparo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="modoPreparo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modo de Preparo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o passo a passo do preparo..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Próximo passo:</strong> Após criar a ficha técnica, você poderá adicionar os ingredientes
            e suas quantidades.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" className="bg-gradient-primary">
            {initialData ? "Salvar Alterações" : "Criar Ficha Técnica"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
